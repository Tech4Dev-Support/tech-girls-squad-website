import crypto from 'crypto';
import { confirmOrder, PaystackVerifyData } from '@/lib/orders';
import {
  sendOrderConfirmation,
  sendDonationConfirmation,
  sendOrderAlert,
  sendDonationAlert,
  sendOpsAlert
} from '@/lib/emailService';

export const runtime = 'nodejs';

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

async function safeSend(label: string, fn: () => Promise<unknown>) {
  try {
    await fn();
  } catch (err) {
    console.error(`Email send failed [${label}]:`, (err as Error)?.message || err);
  }
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!rawBody) {
    return new Response('Expected body', { status: 400 });
  }

  const sig = request.headers.get('x-paystack-signature') || '';
  const expected = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '')
    .update(rawBody)
    .digest('hex');

  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.warn('Invalid Paystack signature');
    return new Response('Invalid signature', { status: 401 });
  }

  let event: PaystackChargeEvent;
  try {
    event = JSON.parse(rawBody) as PaystackChargeEvent;
  } catch {
    return new Response('Invalid body', { status: 400 });
  }

  if (event.event !== 'charge.success') {
    return new Response('Ignored', { status: 200 });
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

    if (outcome === 'duplicate') return new Response('Already processed', { status: 200 });
    if (outcome === 'unknown') return new Response('Unknown reference', { status: 200 });
    if (outcome === 'invalid_status') return new Response('Ignored', { status: 200 });

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
      return new Response('Amount mismatch — logged', { status: 200 });
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
      return new Response('Confirmed — missing email logged', { status: 200 });
    }

    if (isDonation) {
      await safeSend('donation-confirmation', () =>
        sendDonationConfirmation({
          to: customer.email!,
          fullName: m.full_name as string | undefined,
          reference,
          amount: amountNaira
        })
      );
      await safeSend('donation-alert', () =>
        sendDonationAlert({
          reference,
          amount: amountNaira,
          fullName: m.full_name as string | undefined,
          email: customer.email!
        })
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

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error(`Webhook processing failed for ${reference}:`, (err as Error).message);
    return new Response('Processing error', { status: 500 });
  }
}