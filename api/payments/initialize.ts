import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { generateTGSReference } from '@/lib/reference';
import { createOrder } from '@/lib/orders';
import { sendOpsAlert } from '@/lib/emailService';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const SITE_URL = process.env.SITE_URL;
const PRICE_PER_COPY = Number(process.env.PRICE_PER_COPY_NAIRA || 5000);
const MIN_DONATION = Number(process.env.MIN_DONATION_NAIRA || 1000);

const idempotencyCache = new Map<string, { success: true; authorization_url: string; reference: string }>();

interface InitializeBody {
  isDonation?: boolean | string;
  fullName?: string;
  email?: string;
  phone?: string;
  copiesForMe?: number | string;
  numCopies?: number | string;
  copiesToGift?: number | string;
  giftNumCopies?: number | string;
  country?: string;
  state?: string;
  lga?: string;
  addressLine?: string;
  deliveryAddress?: string;
  landmark?: string;
  nearestLandmark?: string;
  donationAmount?: number | string;
  consent?: boolean | string;
  idempotencyKey?: string;
}

function readOrderFields(body: InitializeBody) {
  const pick = (...names: (keyof InitializeBody)[]) => {
    for (const n of names) {
      const v = body[n];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  };

  return {
    isDonation: body.isDonation === true || body.isDonation === 'true',
    fullName: body.fullName,
    email: body.email,
    phone: body.phone,
    copiesForMe: pick('copiesForMe', 'numCopies'),
    copiesToGift: pick('copiesToGift', 'giftNumCopies'),
    country: body.country,
    state: body.state,
    lga: body.lga,
    addressLine: pick('addressLine', 'deliveryAddress'),
    landmark: pick('landmark', 'nearestLandmark'),
    donationAmount: body.donationAmount,
    consent: body.consent,
    idempotencyKey: body.idempotencyKey
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      isDonation, fullName, email, phone, copiesForMe, copiesToGift,
      country, state, lga, addressLine, landmark, donationAmount, consent, idempotencyKey
    } = readOrderFields(req.body as InitializeBody);

    if (!email || !String(email).includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    if (!fullName || !String(fullName).trim()) {
      return res.status(400).json({ error: 'Full name is required' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'Consent is required' });
    }

    const copiesForMeN = Number(copiesForMe) || 0;
    const copiesToGiftN = Number(copiesToGift) || 0;
    const hasPhysical = copiesForMeN > 0;

    if (!Number.isInteger(copiesForMeN) || copiesForMeN < 0 ||
        !Number.isInteger(copiesToGiftN) || copiesToGiftN < 0) {
      return res.status(400).json({ error: 'Copy counts must be non-negative integers' });
    }

    let amountNaira: number;
    let orderType: 'Purchase' | 'Gift' | 'Donation';

    if (isDonation) {
      amountNaira = Number(donationAmount);
      if (!Number.isFinite(amountNaira) || amountNaira < MIN_DONATION) {
        return res.status(400).json({ error: `Minimum donation is ₦${MIN_DONATION.toLocaleString()}` });
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
        if (!phone) return res.status(400).json({ error: 'Phone is required when copies are for you' });
        if (!country || !state || !lga || !addressLine || !landmark) {
          return res.status(400).json({ error: 'Full delivery address is required when copies are for you' });
        }
      }
      amountNaira = (copiesForMeN + copiesToGiftN) * PRICE_PER_COPY;
      orderType = copiesForMeN > 0 ? 'Purchase' : 'Gift';
    }

    const amountKobo = amountNaira * 100;

    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return res.json(idempotencyCache.get(idempotencyKey));
    }

    const reference = generateTGSReference();

    const metadata = {
      order_type: orderType,
      full_name: String(fullName).trim(),
      copies_for_me: copiesForMeN,
      copies_to_gift: copiesToGiftN,
      phone_number: phone || null,
      country: country || null,
      address: hasPhysical ? { line: addressLine, landmark, lga, state, country } : null,
      consent_given: true,
      consent_timestamp: new Date().toISOString()
    };

    const paystackRes = await axios.post(
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

    const authorizationUrl: string | undefined = paystackRes.data?.data?.authorization_url;

    if (!authorizationUrl) {
      console.error(`Paystack init for ${reference} returned no authorization_url`);
      return res.status(500).json({ error: 'Payment initialization failed' });
    }

    let created: boolean;
    let reason: string | undefined;
    try {
      const result = await createOrder({
        reference,
        orderType,
        copiesForMe: copiesForMeN,
        copiesToGift: copiesToGiftN,
        expectedAmountKobo: amountKobo,
        consentGiven: Boolean(consent),
        idempotencyKey: idempotencyKey || null
      });
      created = result.created;
      if (!result.created) reason = result.reason;
    } catch (dbErr) {
      console.error(`createOrder threw for ${reference}:`, (dbErr as Error)?.message || dbErr);
      try {
        await sendOpsAlert({
          subject: `Orphan payment link · ${reference}`,
          body: [
            `Reference: ${reference}`,
            `Paystack init succeeded but createOrder threw.`,
            `Authorization URL: ${authorizationUrl}`,
            `Expected amount: ₦${amountNaira.toLocaleString()}`,
            `Order type: ${orderType}`,
            `Customer email: ${email}`,
            `Action: watch the Paystack dashboard for this reference.`
          ].join('\n')
        });
      } catch (alertErr) {
        console.error('sendOpsAlert (orphan) failed:', (alertErr as Error)?.message || alertErr);
      }
      return res.status(500).json({ error: 'Payment initialization failed' });
    }

    if (!created) {
      console.error(`createOrder refused for ${reference}: ${reason}`);
      try {
        await sendOpsAlert({
          subject: `Order record refused · ${reference} (${reason})`,
          body: [
            `Reference: ${reference}`,
            `Reason: ${reason}`,
            `Authorization URL: ${authorizationUrl}`,
            `Expected amount: ₦${amountNaira.toLocaleString()}`,
            `Order type: ${orderType}`,
            `Customer email: ${email}`
          ].join('\n')
        });
      } catch (alertErr) {
        console.error('sendOpsAlert (refused) failed:', (alertErr as Error)?.message || alertErr);
      }
      if (reason === 'duplicate_idempotency_key') {
        return res.status(409).json({ error: 'This request is already being processed. Please wait a moment.' });
      }
      return res.status(409).json({ error: 'This order is already in progress. Please refresh and try again.' });
    }

    const payload = { success: true as const, authorization_url: authorizationUrl, reference };

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, payload);
      setTimeout(() => idempotencyCache.delete(idempotencyKey), 5 * 60_000).unref?.();
    }

    return res.json(payload);
  } catch (error) {
    const e = error as { response?: { data?: unknown }; message?: string };
    console.error('Paystack Init Error:', e.response?.data || e.message);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}