const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.EMAIL_FROM;           
const ALERTS = process.env.EMAIL_ALERTS;       
const DISPATCH_DAYS = process.env.DISPATCH_DAYS || '5'; 



const firstName = (fullName = '') => fullName.trim().split(/\s+/)[0] || 'there';

const naira = (amount) => Number(amount).toLocaleString('en-NG');

const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat('en-NG', {
    dateStyle: 'long',
    timeZone: 'Africa/Lagos'
  }).format(date);



const FOOTER = `
  <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
  <p style="color:#666;font-size:13px;line-height:1.5">
    <strong>Tech Girls Squad</strong><br/>
    An initiative of Tech4Dev, delivered through Women Techsters
  </p>
`;



// 1. Order confirmation (customer)

async function sendOrderConfirmation({
  to,
  fullName,
  reference,
  copiesForMe = 0,
  copiesToGift = 0,
  amount,
  address,  
}) {
  const hasPersonal = copiesForMe > 0;
  const hasGift = copiesToGift > 0;

  const html = `
    <p>Hi ${firstName(fullName)},</p>
    <p>Thank you for your order.</p>

    <p>
      <strong>Order reference:</strong> ${reference}<br/>
      ${hasPersonal ? `<strong>Copies for you:</strong> ${copiesForMe}<br/>` : ''}
      ${hasGift ? `<strong>Copies gifted:</strong> ${copiesToGift}<br/>` : ''}
      <strong>Total paid:</strong> ₦${naira(amount)}
    </p>

    ${hasPersonal ? `
      <p>
        Your copies will be dispatched within ${DISPATCH_DAYS} working days to:<br/>
        ${address.line}, ${address.landmark}, ${address.lga}, ${address.state}
      </p>
    ` : ''}

    ${hasGift ? `
      <p>
        Your gifted copies will be placed with girls or school libraries that wouldn't otherwise have access.
        Thank you for that.
      </p>
    ` : ''}

    <p>Any questions, just reply to this email.<br/>
       Thank you for helping more girls see themselves in technology.</p>
    ${FOOTER}
  `;

  return resend.emails.send({
    from: FROM,
    to,
    replyTo: ALERTS, // "reply to this email" → lands in the TGS inbox
    subject: 'Your Tech Girls Squad order is confirmed',
    html
  });
}

// Donation confirmation (customer)

async function sendDonationConfirmation({ to, fullName, reference, amount }) {
  const html = `
    <p>Hi ${firstName(fullName)},</p>
    <p>Thank you for your donation.</p>

    <p>
      <strong>Reference:</strong> ${reference}<br/>
      <strong>Amount:</strong> ₦${naira(amount)}
    </p>

    <p>Your support helps us write the next volume and put it in more girls' hands.<br/>
       Any questions, just reply to this email.</p>
    ${FOOTER}
  `;

  return resend.emails.send({
    from: FROM,
    to,
    replyTo: ALERTS,
    subject: 'Thank you for backing the next volume',
    html
  });
}


// Order alert (internal)

async function sendOrderAlert({
  reference,
  copiesForMe = 0,
  copiesToGift = 0,
  amount,
  fullName,
  email,
  phone,
  address,     // { line, landmark, lga, state } — only if copiesForMe > 0
  date = new Date()
}) {
  const hasPersonal = copiesForMe > 0;

  const html = `
    <p>
      Reference: ${reference}<br/>
      Date: ${formatDate(date)}<br/>
      Total paid: ₦${naira(amount)}<br/>
      Copies to post: ${copiesForMe}<br/>
      Copies to gift: ${copiesToGift}<br/>
      Name: ${fullName}<br/>
      Email: ${email}<br/>
      ${hasPersonal ? `Phone: ${phone}<br/>` : ''}
      ${hasPersonal ? `Delivery address: ${address.line} ${address.landmark} ${address.lga}, ${address.state}` : ''}
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email, // alert replies go straight to the customer
    subject: `New order ${reference} · ${copiesForMe} to post, ${copiesToGift} to gift`,
    html
  });
}

// Donation alert (internal)

async function sendDonationAlert({ reference, amount, fullName, email, date = new Date() }) {
  const html = `
    <p>
      Reference: ${reference}<br/>
      Date: ${formatDate(date)}<br/>
      Amount: ₦${naira(amount)}<br/>
      Name: ${fullName}<br/>
      Email: ${email}
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New donation ${reference} · ₦${naira(amount)}`,
    html
  });
}

// Order for Your School (internal)

async function sendSchoolEnquiry({
  schoolName,
  contactPerson,
  role,
  email,
  phone,
  numberOfCopies,
  city,
  state,
  message,
  date = new Date()
}) {
  const html = `
    <p>
      School: ${schoolName}<br/>
      Contact person: ${contactPerson}<br/>
      Role: ${role}<br/>
      Email: ${email}<br/>
      Phone: ${phone}<br/>
      Number of copies: ${numberOfCopies}<br/>
      Location: ${city}, ${state}<br/>
      ${message ? `Message: ${message}<br/>` : ''}
      Received: ${formatDate(date)}
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email, // PRD requires Reply-To = submitter
    subject: `New school order enquiry · ${schoolName}`,
    html
  });
}

// Partner With Us (internal)

async function sendPartnerEnquiry({
  fullName,
  organisation,
  email,
  phone,
  stateOrRegion,
  country,
  message,
  date = new Date()
}) {

    const subjectLabel = organisation && organisation.trim() ? organisation : fullName;

  const html = `
    <p>
      Name: ${fullName}<br/>
      ${organisation ? `Organisation: ${organisation}<br/>` : ''}
      Email: ${email}<br/>
      Phone: ${phone}<br/>
      Location: ${stateOrRegion ? `${stateOrRegion}, ` : ''}${country}<br/>
      Message: ${message}<br/>
      Received: ${formatDate(date)}
    </p>
  `;

  return resend.emails.send({
    from: FROM,
    to: ALERTS,
    replyTo: email,
    subject: `New partnership enquiry · ${subjectLabel}`,
    html
  });
}


// Ops alert

async function sendOpsAlert({ subject, body }) {
  const html = `
    <p style="color:#b00"><strong>⚠ ${subject}</strong></p>
    <pre style="background:#f6f6f6;padding:12px;border-radius:6px;white-space:pre-wrap">${body}</pre>
  `;

  return resend.emails.send({
    from: FROM,
    to: ALERTS,
    subject: `[OPS] ${subject}`,
    html
  });
}

module.exports = {
  sendOrderConfirmation,
  sendDonationConfirmation,
  sendOrderAlert,
  sendDonationAlert,
  sendSchoolEnquiry,
  sendPartnerEnquiry,
  sendOpsAlert
};