import { sendSchoolEnquiry } from '@/lib/emailService';

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const isEmail = (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const REQUIRED = ['schoolName', 'contactPerson', 'role', 'email', 'phone', 'numberOfCopies', 'city', 'state'] as const;

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

  const numberOfCopies = Number(body.numberOfCopies);
  if (!Number.isInteger(numberOfCopies) || numberOfCopies <= 0) {
    return Response.json({ error: 'Number of copies must be a positive integer' }, { status: 400 });
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
    return Response.json({ success: true });
  } catch (err) {
    console.error('School form failed:', (err as Error)?.message || err);
    return Response.json({ error: 'Failed to send' }, { status: 500 });
  }
}