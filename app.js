const express = require('express');
const app = express();
const { connectDB } = require('./db/orders');
const webhookRouter = require('./routes/webhooks');
const paymentRouter = require('./routes/payments');
const formRouter = require('./routes/forms');

const REQUIRED_ENV = [
  'PAYSTACK_SECRET_KEY',
  'SITE_URL',
  'MONGODB_URI',
  'RESEND_API_KEY',
  'EMAIL_FROM',
  'EMAIL_ALERTS'
];
for (const k of REQUIRED_ENV) {
  if (!process.env[k]) {
    console.error(`FATAL: missing required env var ${k}`);
    process.exit(1);
  }
}

app.use('/api/paystack/webhook',
  express.raw({ type: 'application/json' }),
  (req, _res, next) => { req.rawBody = req.body.toString(); next(); }
);

app.use('/api', webhookRouter);

app.use(express.json());

app.use('/api/payments', paymentRouter);
app.use('/api/forms', formRouter);


app.get('/health', (_req, res) => res.send('ok'));


(async () => {
  await connectDB();
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`TGS backend on :${PORT}`));
})();