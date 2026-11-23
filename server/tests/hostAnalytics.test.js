// server/tests/hostAnalytics.test.js
// Verify that analytics aggregation returns correct net revenue after platform fee
// and excludes test payments.

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Express app
const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const PlatformSettings = require('../models/PlatformSettings');
const jwt = require('jsonwebtoken');

let mongo;
let hostToken;
let hostId;
let propertyId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'test' });

  // create host user
  const host = await User.create({
    name: 'Host Analyst',
    email: 'host@analytics.com',
    password: 'hashed', // pre‑hashed in model hook
    role: 'host',
    isVerified: true,
  });
  hostId = host._id;
  hostToken = jwt.sign({ id: hostId, role: 'host' }, process.env.JWT_SECRET || 'testsecret');

  // platform settings with 10% fee
  await PlatformSettings.create({ key: 'global', platformFeePct: 10 });

  // create a property for this host
  const prop = await Property.create({
    title: 'Analytics Property',
    description: 'Testing analytics',
    location: 'Testville',
    price: 200,
    host: hostId,
    isActive: true,
    approvalStatus: 'approved',
  });
  propertyId = prop._id;

  // create two bookings (same month) – one real payment, one test payment
  const bookingReal = await Booking.create({
    property: propertyId,
    host: hostId,
    guest: mongoose.Types.ObjectId(),
    checkIn: new Date('2024-03-01'),
    checkOut: new Date('2024-03-05'),
    status: 'confirmed',
    totalPrice: 800,
  });

  const bookingTest = await Booking.create({
    property: propertyId,
    host: hostId,
    guest: mongoose.Types.ObjectId(),
    checkIn: new Date('2024-03-10'),
    checkOut: new Date('2024-03-12'),
    status: 'confirmed',
    totalPrice: 400,
  });

  // real payment (isTest:false by default)
  await Payment.create({ booking: bookingReal._id, amount: 800, isTest: false });
  // test payment – should be excluded from analytics
  await Payment.create({ booking: bookingTest._id, amount: 400, isTest: true });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Host analytics endpoint', () => {
  test('returns net revenue after platform fee and excludes test payments', async () => {
    const res = await request(app)
      .get('/api/host/overview')
      .set('Authorization', `Bearer ${hostToken}`)
      .expect(200);

    const analytics = res.body?.data?.analytics;
    expect(analytics).toBeDefined();
    // there should be at least one revenue entry for March
    const march = analytics.revenue.find(r => r.month.startsWith('2024-03'));
    expect(march).toBeDefined();
    // gross should be 800 (test payment excluded)
    expect(march.gross).toBe(800);
    // net = gross - 10% fee = 720
    expect(march.net).toBeCloseTo(720);
  });
});
