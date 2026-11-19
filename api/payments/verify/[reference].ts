import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getOrderByReference } from '@/lib/orders';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const REFERENCE_RE = /^TGS-\d{6}-[A-Z0-9]{4}$/;
const TERMINAL_FAILURE = new Set(['failed', 'abandoned', 'reversed']);
const IN_FLIGHT = new Set(['pending', 'ongoing']);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reference } = req.query;
  if (typeof reference !== 'string') {
    return res.status(400).json({ success: false, category: 'invalid', error: 'Invalid reference' });
  }
  if (!REFERENCE_RE.test(reference)) {
    return res.status(400).json({ success: false, category: 'invalid', error: 'Invalid reference' });
  }

  try {
    let paystackRes;
    try {
      paystackRes = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
      );
    } catch (err) {
      const e = err as { response?: { status?: number } };
      if (e.response?.status === 404) {
        return res.status(404).json({
          success: false,
          category: 'unknown',
          status: 'not_found',
          reference
        });
      }
      throw err;
    }

    const { status, data } = paystackRes.data as {
      status: boolean;
      data: {
        status: string;
        reference: string;
        amount: number;
        customer?: { email?: string };
        metadata?: Record<string, unknown>;
      };
    };
    const m = data.metadata || {};

    const dbOrder = await getOrderByReference(reference, { publicView: true }).catch(() => null);

    const copiesForMe = dbOrder?.copies_for_me ?? (m.copies_for_me as number | undefined) ?? 0;
    const copiesToGift = dbOrder?.copies_to_gift ?? (m.copies_to_gift as number | undefined) ?? 0;
    const orderType = dbOrder?.order_type ?? (m.order_type as string | undefined) ?? 'Purchase';
    const expectedAmount = dbOrder?.expected_amount_kobo ?? null;

    let category: 'success' | 'failed' | 'processing' | 'unknown' = 'unknown';
    if (status && data.status === 'success') category = 'success';
    else if (TERMINAL_FAILURE.has(data.status)) category = 'failed';
    else if (IN_FLIGHT.has(data.status)) category = 'processing';

    return res.json({
      success: category === 'success',
      category,
      status: data.status,
      reference: data.reference,
      amount: data.amount,
      expectedAmount,
      customer: data.customer?.email,
      copiesForMe,
      copiesToGift,
      orderType
    });
  } catch (error) {
    const e = error as { response?: { data?: unknown }; message?: string };
    console.error('Verify Error:', e.response?.data || e.message);
    return res.status(500).json({ error: 'Verification failed' });
  }
}