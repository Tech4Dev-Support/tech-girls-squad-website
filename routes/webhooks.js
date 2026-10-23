const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const { confirmOrder } = require('../db/orders');
const {
  sendOrderConfirmation,
  sendDonationConfirmation,
  sendOrderAlert,
  sendDonationAlert,
  sendOpsAlert
} = require('../services/emailService');

router.post('/paystack/webhook', async (req, res) => {
  // ── Preconditions ──
  if (!req.rawBody) {
    console.error('Webhook without rawBody — check app.js raw middleware');
    return res.status(500).send('Server misconfigured');
  }
  if (!req.headers['content-type']?.includes('application/json')) {
    return res.status(400).send('Expected JSON');
  }

  // ── Signature (timing-safe) ──
  const sig = req.headers['x-paystack-signature'] || '';
  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(req.rawBody)
    .digest('hex');

  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('Invalid Paystack signature');
    return res.status(401).send('Invalid signature');
  }

  // ── Parse AFTER verification ──
  let event;
  try {
    event = JSON.parse(req.rawBody);
  } catch {
    console.error('Invalid JSON in webhook body');
    return res.status(400).send('Invalid body');
  }

  if (event.event !== 'charge.success') {
    return res.status(200).send('Ignored');
  }

  const { reference, customer, amount, metadata } = event.data;

  try {
    const { outcome, order } = await confirmOrder(reference, event.data);

    if (outcome === 'duplicate') {
      console.log(`Duplicate webhook for ${reference} — skipping`);
      return res.status(200).send('Already processed');
    }

    if (outcome === 'unknown') {
      console.warn(`Webhook for unknown reference ${reference} — ignoring`);
      return res.status(200).send('Unknown reference');
    }

    if (outcome === 'amount_mismatch') {
      const expectedNaira = (order.expected_amount_kobo / 100).toLocaleString();
      const receivedNaira = (event.data.amount / 100).toLocaleString();
      console.error(
        `Amount mismatch ${reference}: expected ₦${expectedNaira}, got ₦${receivedNaira}`
      );

      // Ops alert only — no customer emails for a mismatched amount.
      await sendOpsAlert({
        subject: `Amount mismatch · ${reference}`,
        body: [
          `Reference: ${reference}`,
          `Expected: ₦${expectedNaira}`,
          `Received: ₦${receivedNaira}`,
          `Customer: ${customer?.email ?? 'unknown'}`,
          `Order type: ${order.order_type}`,
          `Order status: amount_mismatch (do not fulfil until resolved)`,
          `Action: open the Paystack dashboard, refund or top-up accordingly, then update the order status manually.`
        ].join('\n')
      }).catch(err => console.error('sendOpsAlert failed:', err.message));

      return res.status(200).send('Amount mismatch — logged');
    }

    const m = metadata || {};
    const isDonation = m.order_type === 'Donation';
    const amountNaira = amount / 100;

    if (isDonation) {
      await sendDonationConfirmation({
        to: customer.email,
        fullName: m.full_name,
        reference,
        amount: amountNaira
      });

      await sendDonationAlert({
        reference,
        amount: amountNaira,
        fullName: m.full_name,
        email: customer.email
      });
    } else {

      await sendOrderConfirmation({
        to: customer.email,
        fullName: m.full_name,
        reference,
        copiesForMe: m.copies_for_me ?? 0,
        copiesToGift: m.copies_to_gift ?? 0,
        amount: amountNaira,
        address: m.address || null
      });

      await sendOrderAlert({
        reference,
        copiesForMe: m.copies_for_me ?? 0,
        copiesToGift: m.copies_to_gift ?? 0,
        amount: amountNaira,
        fullName: m.full_name,
        email: customer.email,
        phone: m.phone_number || null,
        address: m.address || null
      });
    }

    console.log(`Order confirmed: ${reference} (${m.order_type})`);
    return res.status(200).send('OK');
  } catch (err) {
    console.error(`Webhook processing failed for ${reference}:`, err.message);
    if (err.response?.data) console.error('Response:', err.response.data);
    // 500 → Paystack retries. The DB `pending → confirmed` flip means a retry
    // will see outcome 'duplicate' and skip emails — no double-send.
    return res.status(500).send('Processing error');
  }
});

module.exports = router;