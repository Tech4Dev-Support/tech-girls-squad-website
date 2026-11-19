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

export async function POST(request: Request) {
  let body: InitializeBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  try {
    const {
      isDonation, fullName, email, phone, copiesForMe, copiesToGift,
      country, state, lga, addressLine, landmark, donationAmount, consent, idempotencyKey
    } = readOrderFields(body);

    if (!email || !String(email).includes('@')) {
      return Response.json({ error: 'A valid email is required' }, { status: 400 });
    }
    if (!fullName || !String(fullName).trim()) {
      return Response.json({ error: 'Full name is required' }, { status: 400 });
    }
    if (!consent) {
      return Response.json({ error: 'Consent is required' }, { status: 400 });
    }

    const copiesForMeN = Number(copiesForMe) || 0;
    const copiesToGiftN = Number(copiesToGift) || 0;
    const hasPhysical = copiesForMeN > 0;

    if (!Number.isInteger(copiesForMeN) || copiesForMeN < 0 ||
        !Number.isInteger(copiesToGiftN) || copiesToGiftN < 0) {
      return Response.json({ error: 'Copy counts must be non-negative integers' }, { status: 400 });
    }

    let amountNaira: number;
    let orderType: 'Purchase' | 'Gift' | 'Donation';

    if (isDonation) {
      amountNaira = Number(donationAmount);
      if (!Number.isFinite(amountNaira) || amountNaira < MIN_DONATION) {
        return Response.json({ error: `Minimum donation is ₦${MIN_DONATION.toLocaleString()}` }, { status: 400 });
      }
      if (!Number.isInteger(amountNaira)) {
        return Response.json({ error: 'Donation amount must be a whole number of naira' }, { status: 400 });
      }
      orderType = 'Donation';
    } else {
      if (copiesForMeN === 0 && copiesToGiftN === 0) {
        return Response.json({ error: 'Order must include at least one copy' }, { status: 400 });
      }
      if (hasPhysical) {
        if (!phone) return Response.json({ error: 'Phone is required when copies are for you' }, { status: 400 });
        if (!country || !state || !lga || !addressLine || !landmark) {
          return Response.json({ error: 'Full delivery address is required when copies are for you' }, { status: 400 });
        }
      }
      amountNaira = (copiesForMeN + copiesToGiftN) * PRICE_PER_COPY;
      orderType = copiesForMeN > 0 ? 'Purchase' : 'Gift';
    }

    const amountKobo = amountNaira * 100;

    if (idempotencyKey && idempotencyCache.has(idempotencyKey)) {
      return Response.json(idempotencyCache.get(idempotencyKey), { status: 200 });
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
      return Response.json({ error: 'Payment initialization failed' }, { status: 500 });
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
      return Response.json({ error: 'Payment initialization failed' }, { status: 500 });
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
        return Response.json({ error: 'This request is already being processed. Please wait a moment.' }, { status: 409 });
      }
      return Response.json({ error: 'This order is already in progress. Please refresh and try again.' }, { status: 409 });
    }

    const payload = { success: true as const, authorization_url: authorizationUrl, reference };

    if (idempotencyKey) {
      idempotencyCache.set(idempotencyKey, payload);
      setTimeout(() => idempotencyCache.delete(idempotencyKey), 5 * 60_000).unref?.();
    }

    return Response.json(payload, { status: 200 });
  } catch (error) {
    const e = error as { response?: { data?: unknown }; message?: string };
    console.error('Paystack Init Error:', e.response?.data || e.message);
    return Response.json({ error: 'Payment initialization failed' }, { status: 500 });
  }
}