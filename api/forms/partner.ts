import type { NextApiRequest, NextApiResponse } from 'next';
import { sendPartnerEnquiry } from '@/lib/emailService';

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const REQUIRED = ['fullName', 'email', 'phone', 'country', 'message'] as const;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const body = (req.body || {}) as Record<string, unknown>;

  if (str(body.honeypot)) return res.json({ success: true });

  for (const k of REQUIRED) {
    if (!str(body[k])) return res.status(400).json({ error: `Missing field: ${k}` });
  }

  const email = str(body.email);
  if (!isEmail(email)) return res.status(400).json({ error: 'Invalid email address' });

  try {
    await sendPartnerEnquiry({
      fullName: str(body.fullName),
      organisation: str(body.organisation) || null,
      email,
      phone: str(body.phone),
      stateOrRegion: str(body.stateOrRegion) || null,
      country: str(body.country),
      message: str(body.message)
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('Partner form failed:', (err as Error)?.message || err);
    return res.status(500).json({ error: 'Failed to send' });
  }
}