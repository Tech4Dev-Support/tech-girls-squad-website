import dotenv from 'dotenv';
dotenv.config();
import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

const FROM = process.env.EMAIL_FROM as string;
const ALERTS = process.env.EMAIL_ALERTS as string;
const DISPATCH_DAYS = process.env.DISPATCH_DAYS || '5';

const firstName = (fullName = ''): string =>
  String(fullName ?? '').trim().split(/\s+/)[0] || 'there';

const naira = (amount: number | string): string =>
  Number(amount).toLocaleString('en-NG');

const formatDate = (date: Date = new Date()): string =>
  new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'long',
    timeZone: 'Africa/Lagos'
  }).format(date);

const esc = (s: unknown): string =>
  String(s ?? '').replace(/[&<>"']/g, (c) => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    };
    return map[c];
  });

interface Address {
  line?: string;
  landmark?: string;
  lga?: string;
  state?: string;
  country?: string;
}

const formatAddress = (address: Address | null | undefined): string | null => {
  if (!address || typeof address !== 'object') return null;
  const parts = [address.line, address.landmark, address.lga, address.state]
    .filter((p): p is string => Boolean(p && String(p).trim()))
    .map((p) => esc(p));
  return parts.length ? parts.join(', ') : null;
};

const FOOTER = `
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
  <p style="color:#666;font-size:13px;line-height:1.5">
    <strong>Tech Girls Squad</strong><br/>
    An initiative of Tech4Dev, delivered through Women Techsters
  </p>
`;

// 1. Order confirmation (customer)
export async function sendOrderConfirmation(params: {
  to: string;
  fullName?: string;
  reference: string;
  copiesForMe?: number;
  copiesToGift?: number;
  amount: number;
  address?: Address | null;
}) {
  const { to, fullName, reference, copiesForMe = 0, copiesToGift = 0, amount, address } = params;
  const hasPersonal = copiesForMe > 0;
  const hasGift = copiesToGift > 0;
  const addr = formatAddress(address);

  const html = `
    <p>Hi ${esc(firstName(fullName))},</p>
    <p>Thank you for your order.</p>
    <p>
      <strong>Order reference:</strong> ${esc(reference)}<br/>
      ${hasPersonal ? `<strong>Copies for you:</strong> ${esc(copiesForMe)}<br/>` : ''}
      ${hasGift ? `<strong>Copies gifted:</strong> ${esc(copiesToGift)}<br/>` : ''}
      <strong>Total paid:</strong> ₦${esc(naira(amount))}
    </p>
    ${hasPersonal ? (
      addr
        ? `<p>Your copies will be dispatched within ${esc(DISPATCH_DAYS)} working days to:<br/>${addr}</p>`
        : `<p>Your copies will be dispatched within ${esc(DISPATCH_DAYS)} working days. We'll be in touch to confirm your delivery address.</p>`
    ) : ''}
    ${hasGift ? `<p>Your gifted copies will be placed with girls or school libraries that wouldn't otherwise have access. Thank you for that.</p>` : ''}
    <p>Any questions, just reply to this email.<br/>Thank you for helping more girls see themselves in technology.</p>
    ${FOOTER}
  `;

  return getResend().emails.send({
    from: FROM,
    to,
    replyTo: ALERTS,
    subject: 'Your Tech Girls Squad order is confirmed',
    html
  });
}

// 2. Donation confirmation (customer)
export async function sendDonationConfirmation(params: {
  to: string;
  fullName?: string;
  reference: string;
  amount: number;
}) {
  const { to, fullName, reference, amount } = params;
  const html = `
    <p>Hi ${esc(firstName(fullName))},</p>
    <p>Thank you for your donation.</p>
    <p>
      <strong>Reference:</strong> ${esc(reference)}<br/>
      <strong>Amount:</strong> ₦${esc(naira(amount))}
    </p>
    <p>Your support helps us write the next volume and put it in more girls' hands.<br/>
       Any questions, just reply to this email.</p>
    ${FOOTER}
  `;
  return getResend().emails.send({
    from: FROM,
    to,
    replyTo: ALERTS,
    subject: 'Thank you for backing the next volume',
    html
  });
}

// 3. Order alert (internal)
export async function sendOrderAlert(params: {
  reference: string;
  copiesForMe?: number;
  copiesToGift?: number;
  amount: number;
  fullName?: string;
  email: string;
  phone?: string | null;
  address?: Address | null;
  date?: Date;
}) {
  const {
    reference, copiesForMe = 0, copiesToGift = 0, amount, fullName, email, phone, address, date = new Date()
  } = params;
  const hasPersonal = copiesForMe > 0;
  const addr = formatAddress(address);

  const html = `
    <p>
      Reference: ${esc(reference)}<br/>
      Date: ${esc(formatDate(date))}<br/>
      Total paid: ₦${esc(naira(amount))}<br/>
      Copies to post: ${esc(copiesForMe)}<br/>
      Copies to gift: ${esc(copiesToGift)}<br/>
      Name: ${esc(fullName)}<br/>
      Email: ${esc(email)}<br/>
      ${hasPersonal && phone ? `Phone: ${esc(phone)}<br/>` : ''}
      ${hasPersonal && addr ? `Delivery address: ${addr}` : ''}
    </p>
  `;

  return getResend().emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New order ${esc(reference)} · ${esc(copiesForMe)} to post, ${esc(copiesToGift)} to gift`,
    html
  });
}

// 4. Donation alert (internal)
export async function sendDonationAlert(params: {
  reference: string;
  amount: number;
  fullName?: string;
  email: string;
  date?: Date;
}) {
  const { reference, amount, fullName, email, date = new Date() } = params;
  const html = `
    <p>
      Reference: ${esc(reference)}<br/>
      Date: ${esc(formatDate(date))}<br/>
      Amount: ₦${esc(naira(amount))}<br/>
      Name: ${esc(fullName)}<br/>
      Email: ${esc(email)}
    </p>
  `;
  return getResend().emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New donation ${esc(reference)} · ₦${esc(naira(amount))}`,
    html
  });
}

// 5. School enquiry (internal)
export async function sendSchoolEnquiry(params: {
  schoolName?: string;
  contactPerson?: string;
  role?: string;
  email: string;
  phone?: string;
  numberOfCopies: number | string;
  deliveryAddress?: string;
  message?: string | null;
  date?: Date;
}) {
  const {
    schoolName, contactPerson, role, email, phone, numberOfCopies, deliveryAddress, message, date = new Date()
  } = params;
  const html = `
    <p>
      School: ${esc(schoolName)}<br/>
      Contact person: ${esc(contactPerson)}<br/>
      Role: ${esc(role)}<br/>
      Email: ${esc(email)}<br/>
      Phone: ${esc(phone)}<br/>
      Number of copies: ${esc(numberOfCopies)}<br/>
      Delivery address: ${esc(deliveryAddress)}<br/>
      ${message ? `Message: ${esc(message)}<br/>` : ''}
      Received: ${esc(formatDate(date))}
    </p>
  `;
  return getResend().emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New school order enquiry · ${esc(schoolName)}`,
    html
  });
}

// 6. Partner enquiry (internal)
export async function sendPartnerEnquiry(params: {
  fullName?: string;
  organisation?: string | null;
  email: string;
  phone?: string;
  stateOrRegion?: string | null;
  country?: string;
  message?: string;
  date?: Date;
}) {
  const {
    fullName, organisation, email, phone, stateOrRegion, country, message, date = new Date()
  } = params;
  const subjectLabel = organisation && String(organisation).trim() ? organisation : fullName;

  const html = `
    <p>
      Name: ${esc(fullName)}<br/>
      ${organisation ? `Organisation: ${esc(organisation)}<br/>` : ''}
      Email: ${esc(email)}<br/>
      Phone: ${esc(phone)}<br/>
      Location: ${stateOrRegion ? `${esc(stateOrRegion)}, ` : ''}${esc(country)}<br/>
      Message: ${esc(message)}<br/>
      Received: ${esc(formatDate(date))}
    </p>
  `;
  return getResend().emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New partnership enquiry · ${esc(subjectLabel)}`,
    html
  });
}

// 7. Ops alert
export async function sendOpsAlert(params: { subject: string; body: string }) {
  const { subject, body } = params;
  const html = `
    <p style="color:#b00"><strong>⚠ ${esc(subject)}</strong></p>
    <pre style="background:#f6f6f6;padding:12px;border-radius:6px;white-space:pre-wrap">${esc(body)}</pre>
  `;
  return getResend().emails.send({
    from: FROM,
    to: ALERTS,
    subject: `[OPS] ${esc(subject)}`,
    html
  });
}
