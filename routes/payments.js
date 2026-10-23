const express = require('express');
const router = express.Router();
const axios = require('axios');
const { generateTGSReference } = require('../utils/reference');
const { createOrder, getOrderByReference } = require('../db/orders');

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const SITE_URL = process.env.SITE_URL;

const PRICE_PER_COPY = Number(process.env.PRICE_PER_COPY_NAIRA || 5000);
const MIN_DONATION = Number(process.env.MIN_DONATION_NAIRA || 1000);


const idempotencyCache = new Map();

const REFERENCE_RE = /^TGS-\d{6}-[A-Z0-9]{4}$/;

const TERMINAL_FAILURE = new Set(['failed', 'abandoned', 'reversed']);
const IN_FLIGHT = new Set(['pending', 'ongoing']);

router.post('/initialize', async (req, res) => {
  try {
    const {
      isDonation = false,
      fullName,
      email,
      phone,
      copiesForMe,
      copiesToGift,
      country,
      state,
      lga,
      addressLine,
      landmark,
      donationAmount,
      consent,
      idempotencyKey
    } = req.body || {};

    // ── Base validation ──
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'Consent is required' });
    }

    // ── Type-specific validation + server-side amount ──
    const copiesForMeN = Number(copiesForMe) || 0;
    const copiesToGiftN = Number(copiesToGift) || 0;
    const hasPhysical = copiesForMeN > 0;

    if (!Number.isInteger(copiesForMeN) || copiesForMeN < 0 ||
        !Number.isInteger(copiesToGiftN) || copiesToGiftN < 0) {
      return res.status(400).json({ error: 'Copy counts must be non-negative integers' });
    }

    let amountNaira;
    let orderType;

    if (isDonation) {
      amountNaira = Number(donationAmount);
      if (!Number.isFinite(amountNaira) || amountNaira < MIN_DONATION) {
        return res.status(400).json({
          error: `Minimum donation is ₦${MIN_DONATION.toLocaleString()}`
        });
      }
      if (!Number.isInteger(amountNaira)) {
        return res.status(400).json({ error: 'Donation amount must be a whole number of naira' });
      }
      orderType = 'Donation';
    } else {
      if (copiesForMeN === 0 && copiesToGiftN === 0) {
        return res.status(400).json({ error: 'Order must include at least one copy' });
      }
      if (hasPhysical) {
        if (!phone) {
          return res.status(400).json({ error: 'Phone is required when copies are for you' });
        }
        if (!country || !state || !lga || !addressLine || !landmark) {
          return res.status(400).json({
            error: 'Full delivery address is required when copies are for you'
          });
        }
      }
      amountNaira = (copiesForMeN + copiesToGiftN) * PRICE_PER_COPY;
      orderType = copiesForMeN > 0 ? 'Purchase' : 'Gift';
    }

    const amountKobo = amountNaira * 100;

    // ── Idempotency (short-circuit replay of same request) ──
    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return res.json(idempotencyCache.get(idempotencyKey));
    }

    // ── Reference + metadata ──
    const reference = generateTGSReference();

    const metadata = {
      order_type: orderType,
      full_name: fullName,
      copies_for_me: copiesForMeN,
      copies_to_gift: copiesToGiftN,
      phone_number: phone || null,
      country: country || null,
      address: hasPhysical
        ? { line: addressLine, landmark, lga, state, country }
        : null,
      consent_given: true,
      consent_timestamp: new Date().toISOString()
    };

    // ── Call Paystack first ──
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amountKobo,
        reference,
        callback_url: `${SITE_URL}/payment/callback`,
        metadata,
        channels: ['card', 'bank', 'ussd', 'bank_transfer']
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // ── Persist the order AFTER Paystack accepts it ──
    // Rationale: an orphan payment is recoverable from the Paystack dashboard;
    // a pending order with no payment is not. We prefer the recoverable failure.
    const { created, reason } = await createOrder({
      reference,
      email,
      fullName,
      phone,
      orderType,
      copiesForMe: copiesForMeN,
      copiesToGift: copiesToGiftN,
      address: hasPhysical
        ? { line: addressLine, landmark, lga, state, country }
        : null,
      expectedAmountKobo: amountKobo,
      consentGiven: Boolean(consent),
      idempotencyKey: idempotencyKey || null
    });

    if (!created) {
      console.error(`createOrder failed for ${reference}: ${reason}`);
      return res.status(409).json({
        error: 'This order is already in progress. Please refresh and try again.'
      });
    }

    const payload = {
      success: true,
      authorization_url: response.data.data.authorization_url,
      reference
    };

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, payload);
      setTimeout(() => idempotencyCache.delete(idempotencyKey), 5 * 60_000).unref?.();
    }

    return res.json(payload);
  } catch (error) {
    // Never log the full error — it may carry request headers (the secret key).
    console.error('Paystack Init Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
});

router.get('/verify/:reference', async (req, res) => {
  try {
    const { reference } = req.params;

    if (!REFERENCE_RE.test(reference)) {
      return res.status(400).json({ success: false, error: 'Invalid reference' });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const { status, data } = response.data;
    const m = data.metadata || {};

    // DB is authoritative for expected values; metadata is the fallback.
    const dbOrder = await getOrderByReference(reference, { publicView: true }).catch(() => null);

    const copiesForMe = dbOrder?.copies_for_me ?? m.copies_for_me ?? 0;
    const copiesToGift = dbOrder?.copies_to_gift ?? m.copies_to_gift ?? 0;
    const orderType = dbOrder?.order_type ?? m.order_type ?? 'Purchase';
    const expectedAmount = dbOrder?.expected_amount_kobo ?? null;

    // Category tells the frontend which page to show — never switch on raw status.
    let category = 'unknown';
    if (status && data.status === 'success') category = 'success';
    else if (TERMINAL_FAILURE.has(data.status)) category = 'failed';
    else if (IN_FLIGHT.has(data.status)) category = 'processing';

    return res.json({
      success: category === 'success',
      category,
      status: data.status, // raw Paystack status, for debugging only
      reference: data.reference,
      amount: data.amount,
      expectedAmount,
      customer: data.customer?.email,
      copiesForMe,
      copiesToGift,
      orderType
    });
  } catch (error) {
    console.error('Verify Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;