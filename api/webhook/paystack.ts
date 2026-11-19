import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { confirmOrder, PaystackVerifyData } from '@/lib/orders';
import {
  sendOrderConfirmation,
  sendDonationConfirmation,
  sendOrderAlert,
  sendDonationAlert,
  sendOpsAlert
} from '@/lib/emailService';

export const config = { api: { bodyParser: false } };

interface PaystackChargeEvent {
  event: string;
  data: {
    id: number;
    reference: string;
    status: string;
    amount: number;
    channel?: string;
    paid_at?: string;
    customer?: { email?: string };
    metadata?: Record<string, unknown>;
  };
}

function getRawBody(req: NextApiRequest): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: Buffer) => { data += chunk.toString('utf8'); });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function safeSend(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (err) {
    console.error(`Email send failed [${label}]:`, (err as Error)?.message || err);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }

  const rawBody = await getRawBody(req);
  if (!rawBody) {
    return res.status(400).send('Expected body');
  }

  const sig = (req.headers['x-paystack-signature'] as string) || '';
  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('Invalid Paystack signature');
    return res.status(401).send('Invalid signature');
  }

  let event: PaystackChargeEvent;
  try {
    event = JSON.parse(rawBody) as PaystackChargeEvent;
  } catch {
    return res.status(400).send('Invalid body');
  }

  if (event.event !== 'charge.success') {
    return res.status(200).send('Ignored');
  }

  const { reference, customer, amount, metadata } = event.data;

  try {
    const paystackData: PaystackVerifyData = {
      id: event.data.id,
      amount: event.data.amount,
      channel: event.data.channel,
      paid_at: event.data.paid_at,
      status: event.data.status
    };
    const { outcome, order } = await confirmOrder(reference, paystackData);

    if (outcome === 'duplicate') return res.status(200).send('Already processed');
    if (outcome === 'unknown') return res.status(200).send('Unknown reference');
    if (outcome === 'invalid_status') return res.status(200).send('Ignored');

    if (outcome === 'amount_mismatch') {
      const expectedNaira = (order.expected_amount_kobo / 100).toLocaleString();
      const receivedNaira = (event.data.amount / 100).toLocaleString();
      await safeSend('amount-mismatch-ops-alert', () =>
        sendOpsAlert({
          subject: `Amount mismatch · ${reference}`,
          body: [
            `Reference: ${reference}`,
            `Expected: ₦${expectedNaira}`,
            `Received: ₦${receivedNaira}`,
            `Customer: ${customer?.email ?? 'unknown'}`,
            `Order type: ${order.order_type}`,
            `Action: refund or top-up in Paystack dashboard, then update status manually.`
          ].join('\n')
        })
      );
      return res.status(200).send('Amount mismatch — logged');
    }

    const m = metadata || {};
    const isDonation = m.order_type === 'Donation';
    const amountNaira = amount / 100;

    if (!customer?.email) {
      await safeSend('missing-email-ops-alert', () =>
        sendOpsAlert({
          subject: `Confirmed order missing customer email · ${reference}`,
          body: `Reference ${reference} confirmed but event.data.customer.email is absent.`
        })
      );
      return res.status(200).send('Confirmed — missing email logged');
    }

    if (isDonation) {
      await safeSend('donation-confirmation', () =>
        sendDonationConfirmation({ to: customer.email!, fullName: m.full_name as string | undefined, reference, amount: amountNaira })
      );
      await safeSend('donation-alert', () =>
        sendDonationAlert({ reference, amount: amountNaira, fullName: m.full_name as string | undefined, email: customer.email! })
      );
    } else {
      await safeSend('order-confirmation', () =>
        sendOrderConfirmation({
          to: customer.email!,
          fullName: m.full_name as string | undefined,
          reference,
          copiesForMe: (m.copies_for_me as number | undefined) ?? 0,
          copiesToGift: (m.copies_to_gift as number | undefined) ?? 0,
          amount: amountNaira,
          address: (m.address as { line?: string; landmark?: string; lga?: string; state?: string; country?: string } | null) || null
        })
      );
      await safeSend('order-alert', () =>
        sendOrderAlert({
          reference,
          copiesForMe: (m.copies_for_me as number | undefined) ?? 0,
          copiesToGift: (m.copies_to_gift as number | undefined) ?? 0,
          amount: amountNaira,
          fullName: m.full_name as string | undefined,
          email: customer.email!,
          phone: (m.phone_number as string | undefined) ?? null,
          address: (m.address as { line?: string; landmark?: string; lga?: string; state?: string; country?: string } | null) || null
        })
      );
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error(`Webhook processing failed for ${reference}:`, (err as Error).message);
    return res.status(500).send('Processing error');
  }
}