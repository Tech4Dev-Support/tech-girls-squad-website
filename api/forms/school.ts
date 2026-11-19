import type { NextApiRequest, NextApiResponse } from 'next';
import { sendSchoolEnquiry } from '@/lib/emailService';

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const REQUIRED = ['schoolName', 'contactPerson', 'role', 'email', 'phone', 'numberOfCopies', 'city', 'state'] as const;

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

  const numberOfCopies = Number(body.numberOfCopies);
  if (!Number.isInteger(numberOfCopies) || numberOfCopies <= 0) {
    return res.status(400).json({ error: 'Number of copies must be a positive integer' });
  }

  try {
    await sendSchoolEnquiry({
      schoolName: str(body.schoolName),
      contactPerson: str(body.contactPerson),
      role: str(body.role),
      email,
      phone: str(body.phone),
      numberOfCopies,
      city: str(body.city),
      state: str(body.state),
      message: str(body.message) || null
    });
    return res.json({ success: true });
  } catch (err) {
    console.error('School form failed:', (err as Error)?.message || err);
    return res.status(500).json({ error: 'Failed to send' });
  }
}