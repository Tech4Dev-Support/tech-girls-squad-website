import { MongoClient, Db, ObjectId, WithId } from 'mongodb';

export type OrderType = 'Purchase' | 'Gift' | 'Donation';
export type OrderStatus = 'pending' | 'confirmed' | 'amount_mismatch' | 'abandoned';

interface PaystackData {
  transactionId?: number;
  amount: number;
  channel?: string;
  paidAt?: string;
}

interface OrderDoc {
  reference: string;
  order_type: OrderType;
  copies_for_me: number;
  copies_to_gift: number;
  expected_amount_kobo: number;
  consent_given: boolean;
  idempotency_key: string | null;
  status: OrderStatus;
  createdAt: Date;
  confirmedAt?: Date;
  mismatchAt?: Date;
  abandonedAt?: Date;
  received_amount_kobo?: number;
  paystackData?: PaystackData;
}

export interface PaystackVerifyData {
  id?: number;
  amount: number;
  channel?: string;
  paid_at?: string;
  status?: string;
}

export interface CreateOrderInput {
  reference: string;
  orderType: OrderType;
  copiesForMe?: number;
  copiesToGift?: number;
  expectedAmountKobo: number;
  consentGiven?: boolean;
  idempotencyKey?: string | null;
}

export type CreateOrderResult =
  | { created: true; id: ObjectId }
  | { created: false; reason: 'duplicate_reference' | 'duplicate_idempotency_key' };

export type ConfirmResult =
  | { outcome: 'confirmed'; order: WithId<OrderDoc> }
  | { outcome: 'duplicate'; order: WithId<OrderDoc> }
  | { outcome: 'amount_mismatch'; order: WithId<OrderDoc> }
  | { outcome: 'unknown'; order: null }
  | { outcome: 'invalid_status'; order: null };

export interface PublicViewOrder {
  reference: string;
  order_type: OrderType;
  copies_for_me: number;
  copies_to_gift: number;
  expected_amount_kobo: number;
  status: OrderStatus;
  createdAt: Date;
  confirmedAt?: Date;
}

const VALID_ORDER_TYPES = new Set<OrderType>(['Purchase', 'Gift', 'Donation']);
const DB_NAME = process.env.MONGODB_DB || 'tech_girls_squad';

interface Cache {
  client: MongoClient | null;
  db: Db | null;
  promise: Promise<Db> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongo: Cache | undefined;
}

if (!global._mongo) {
  global._mongo = { client: null, db: null, promise: null };
}

export async function connectDB(): Promise<Db> {
  const cached = global._mongo!;
  if (cached.db) return cached.db;

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
  }

  if (!cached.promise) {
    cached.client = new MongoClient(process.env.MONGODB_URI);
    cached.promise = cached.client.connect().then((c) => c.db(DB_NAME));
  }
  const db = await cached.promise;
  cached.db = db;

  const orders = db.collection<OrderDoc>('orders');
  await orders.createIndex({ reference: 1 }, { unique: true });
  await orders.createIndex({ status: 1, createdAt: -1 });
  await orders.createIndex({ order_type: 1, createdAt: -1 });
  await orders.createIndex(
    { idempotency_key: 1 },
    { unique: true, partialFilterExpression: { idempotency_key: { $type: 'string' } } }
  );

  return db;
}

export async function createOrder(input: CreateOrderInput): Promise<CreateOrderResult> {
  const db = await connectDB();

  const {
    reference,
    orderType,
    copiesForMe = 0,
    copiesToGift = 0,
    expectedAmountKobo,
    consentGiven = true,
    idempotencyKey = null
  } = input;

  if (!reference || typeof reference !== 'string') {
    throw new Error('createOrder: reference is required');
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

  const doc: OrderDoc = {
    reference,
    order_type: orderType,
    copies_for_me: copiesForMe,
    copies_to_gift: copiesToGift,
    expected_amount_kobo: expectedAmountKobo,
    consent_given: consentGiven,
    idempotency_key: idempotencyKey || null,
    status: 'pending',
    createdAt: new Date()
  };

  try {
    const result = await db.collection<OrderDoc>('orders').insertOne(doc);
    return { created: true, id: result.insertedId };
  } catch (err) {
    const e = err as { code?: number; keyPattern?: Record<string, unknown> };
    if (e.code === 11000) {
      const key = e.keyPattern || {};
      if (key.idempotency_key) {
        return { created: false, reason: 'duplicate_idempotency_key' };
      }
      return { created: false, reason: 'duplicate_reference' };
    }
    throw err;
  }
}

export async function confirmOrder(
  reference: string,
  paystackData: PaystackVerifyData
): Promise<ConfirmResult> {
  const db = await connectDB();
  const orders = db.collection<OrderDoc>('orders');

  if (paystackData?.status && paystackData.status !== 'success') {
    return { outcome: 'invalid_status', order: null };
  }

  const pending = await orders.findOne({ reference, status: 'pending' });
  if (!pending) {
    const existing = await orders.findOne({ reference });
    if (existing) return { outcome: 'duplicate', order: existing };
    return { outcome: 'unknown', order: null };
  }

  if (
    Number.isInteger(pending.expected_amount_kobo) &&
    paystackData.amount !== pending.expected_amount_kobo
  ) {
    await orders.updateOne(
      { reference, status: 'pending' },
      {
        $set: {
          status: 'amount_mismatch' as const,
          mismatchAt: new Date(),
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

  const result = await orders.findOneAndUpdate(
    { reference, status: 'pending' },
    {
      $set: {
        status: 'confirmed' as const,
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

  if (result) return { outcome: 'confirmed', order: result };

  const existing = await orders.findOne({ reference });
  return existing
    ? { outcome: 'duplicate', order: existing }
    : { outcome: 'unknown', order: null };
}

export async function getOrderByReference(
  reference: string,
  opts: { publicView: true }
): Promise<PublicViewOrder | null>;
export async function getOrderByReference(
  reference: string,
  opts?: { publicView?: false }
): Promise<WithId<OrderDoc> | null>;
export async function getOrderByReference(
  reference: string,
  { publicView = false }: { publicView?: boolean } = {}
): Promise<WithId<OrderDoc> | PublicViewOrder | null> {
  const db = await connectDB();
  const collection = db.collection<OrderDoc>('orders');

  if (publicView) {
    return collection.findOne<PublicViewOrder>(
      { reference },
      {
        projection: {
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
      }
    );
  }
  return collection.findOne({ reference });
}

export async function sweepAbandoned(olderThanHours = 24): Promise<number> {
  const db = await connectDB();
  const cutoff = new Date(Date.now() - olderThanHours * 3600 * 1000);
  const result = await db.collection<OrderDoc>('orders').updateMany(
    { status: 'pending', createdAt: { $lt: cutoff } },
    { $set: { status: 'abandoned' as const, abandonedAt: new Date() } }
  );
  return result.modifiedCount;
}