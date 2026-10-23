const { MongoClient } = require('mongodb');

let client;
let db;

const VALID_ORDER_TYPES = new Set(['Purchase', 'Gift', 'Donation']);

async function connectDB() {
  if (db) return db;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('tgs');

  await db.collection('orders').createIndex({ reference: 1 }, { unique: true });
  await db.collection('orders').createIndex({ status: 1, createdAt: -1 });
  await db.collection('orders').createIndex({ email: 1, createdAt: -1 });

  return db;
}

async function createOrder(orderData) {
  await connectDB();

  const {
    reference,
    email,
    fullName,
    phone,
    orderType,
    copiesForMe = 0,
    copiesToGift = 0,
    address = null,
    expectedAmountKobo,
    consentGiven = true,
    idempotencyKey = null
  } = orderData;

  // ── Validation ──
  if (!reference || typeof reference !== 'string') {
    throw new Error('createOrder: reference is required');
  }
  if (!email || !email.includes('@')) {
    throw new Error('createOrder: valid email is required');
  }
  if (!VALID_ORDER_TYPES.has(orderType)) {
    throw new Error(`createOrder: invalid orderType '${orderType}'`);
  }
  if (!Number.isInteger(expectedAmountKobo) || expectedAmountKobo <= 0) {
    throw new Error('createOrder: expectedAmountKobo must be a positive integer');
  }
  if (
    !Number.isInteger(copiesForMe) || copiesForMe < 0 ||
    !Number.isInteger(copiesToGift) || copiesToGift < 0
  ) {
    throw new Error('createOrder: copy counts must be non-negative integers');
  }

  const doc = {
    reference,
    email,
    full_name: fullName || null,
    phone_number: phone || null,
    order_type: orderType,
    copies_for_me: copiesForMe,
    copies_to_gift: copiesToGift,
    address,
    expected_amount_kobo: expectedAmountKobo,
    consent_given: consentGiven,
    idempotency_key: idempotencyKey,
    status: 'pending',
    createdAt: new Date()
  };

  try {
    const result = await db.collection('orders').insertOne(doc);
    return { created: true, id: result.insertedId };
  } catch (err) {
    if (err.code === 11000) {
      return { created: false, reason: 'duplicate_reference' };
    }
    throw err;
  }
}

// Confirm a pending order atomically.

async function confirmOrder(reference, paystackData) {
  await connectDB();

  const pending = await db.collection('orders').findOne({ reference, status: 'pending' });

  if (!pending) {
    const existing = await db.collection('orders').findOne({ reference });
    if (existing) return { outcome: 'duplicate', order: existing };
    return { outcome: 'unknown', order: null };
  }

  if (
    Number.isInteger(pending.expected_amount_kobo) &&
    paystackData.amount !== pending.expected_amount_kobo
  ) {
    await db.collection('orders').updateOne(
      { reference, status: 'pending' },
      {
        $set: {
          status: 'amount_mismatch',
          mismatchAt: new Date(),
          expected_amount_kobo: pending.expected_amount_kobo,
          received_amount_kobo: paystackData.amount,
          paystackData: {
            transactionId: paystackData.id,
            amount: paystackData.amount,
            channel: paystackData.channel,
            paidAt: paystackData.paid_at
          }
        }
      }
    );
    return { outcome: 'amount_mismatch', order: pending };
  }

  const result = await db.collection('orders').findOneAndUpdate(
    { reference, status: 'pending' },
    {
      $set: {
        status: 'confirmed',
        confirmedAt: new Date(),
        paystackData: {
          transactionId: paystackData.id,
          amount: paystackData.amount,
          channel: paystackData.channel,
          paidAt: paystackData.paid_at
        }
      }
    },
    { returnDocument: 'after' }
  );

  if (result.value) return { outcome: 'confirmed', order: result.value };

  const existing = await db.collection('orders').findOne({ reference });
  return existing
    ? { outcome: 'duplicate', order: existing }
    : { outcome: 'unknown', order: null };
}

async function getOrderByReference(reference, { publicView = false } = {}) {
  await connectDB();

  const projection = publicView
    ? {
        _id: 0,
        reference: 1,
        order_type: 1,
        copies_for_me: 1,
        copies_to_gift: 1,
        expected_amount_kobo: 1,
        status: 1,
        createdAt: 1,
        confirmedAt: 1
      }
    : {};

  return db.collection('orders').findOne({ reference }, { projection });
}

// Mark pending orders older than `olderThanHours` as abandoned.

async function sweepAbandoned(olderThanHours = 24) {
  await connectDB();
  const cutoff = new Date(Date.now() - olderThanHours * 3600 * 1000);
  const result = await db.collection('orders').updateMany(
    { status: 'pending', createdAt: { $lt: cutoff } },
    { $set: { status: 'abandoned', abandonedAt: new Date() } }
  );
  return result.modifiedCount;
}

module.exports = {
  connectDB,
  createOrder,
  confirmOrder,
  getOrderByReference,
  sweepAbandoned
};