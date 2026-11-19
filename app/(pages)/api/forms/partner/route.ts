import { sendPartnerEnquiry } from '@/lib/emailService';

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const REQUIRED = ['fullName', 'email', 'phone', 'country', 'message'] as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (str(body.honeypot)) return Response.json({ success: true });

  for (const k of REQUIRED) {
    if (!str(body[k])) return Response.json({ error: `Missing field: ${k}` }, { status: 400 });
  }

  const email = str(body.email);
  if (!isEmail(email)) return Response.json({ error: 'Invalid email address' }, { status: 400 });

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
    return Response.json({ success: true });
  } catch (err) {
    console.error('Partner form failed:', (err as Error)?.message || err);
    return Response.json({ error: 'Failed to send' }, { status: 500 });
  }
}