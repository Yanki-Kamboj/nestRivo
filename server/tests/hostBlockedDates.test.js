// server/tests/hostBlockedDates.test.js
// Jest test to ensure host blocked dates are respected by the booking engine.

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Express app
const User = require('../models/User');
const Property = require('../models/Property');
const HostBlockedDate = require('../models/HostBlockedDate');
const jwt = require('jsonwebtoken');

let mongo;
let hostToken;
let propertyId;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri(), { dbName: 'test' });

  // create a host user
  const host = await User.create({
    name: 'Host Test',
    email: 'host@test.com',
    password: 'hashed', // assume password hashing is in pre save hook
    role: 'host',
    isVerified: true,
  });

  // sign JWT (use same secret as your auth middleware – adjust if needed)
  hostToken = jwt.sign({ id: host._id, role: 'host' }, process.env.JWT_SECRET || 'testsecret');

  // create a property owned by host
  const prop = await Property.create({
    title: 'Test Property',
    description: 'A nice place',
    location: 'Test City',
    price: 100,
    host: host._id,
    isActive: true,
    approvalStatus: 'approved',
  });
  propertyId = prop._id;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

describe('Host blocked dates enforcement', () => {
  test('Booking overlapping a blocked date should be rejected', async () => {
    // create a blocked date range for the property
    await HostBlockedDate.create({
      property: propertyId,
      start: new Date('2024-06-10'),
      end: new Date('2024-06-15'),
      createdBy: mongoose.Types.ObjectId(),
    });

    // attempt to create a booking that overlaps the blocked range
    const res = await request(app)
      .post('/api/bookings')
      .set('Authorization', `Bearer ${hostToken}`) // depending on your auth guard, may need guest token; using host for simplicity
      .send({
        property: propertyId,
        checkIn: '2024-06-12', // overlaps blocked dates
        checkOut: '2024-06-14',
        guests: 2,
        totalPrice: 300,
      });

    // Expect a 400 Bad Request with a message indicating unavailable dates
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/unavailable|blocked|conflict/i);
  });
});
