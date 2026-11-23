require('dotenv').config();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');

async function createFirstAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME?.trim();

  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set ADMIN_EMAIL to a valid email address.');
  }
  if (!password) throw new Error('Set ADMIN_PASSWORD before running this command.');

  await mongoose.connect(process.env.MONGODB_URI);
  const existingAdmin = await User.exists({ $or: [{ isAdmin: true }, { role: 'admin' }] });
  if (existingAdmin) throw new Error('An admin account already exists; no changes were made.');

  const existingUser = await User.findOne({ email }).select('+password');
  if (existingUser) {
    const passwordMatches = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatches) throw new Error('ADMIN_PASSWORD does not match that account.');

    existingUser.roles = [...new Set([...(existingUser.roles || []), 'guest'])];
    existingUser.isAdmin = true;
    existingUser.role = 'admin';
    await existingUser.save();
    console.log('Existing account is now the first admin. Sign in with its current email and password.');
    return;
  }

  if (!name || name.length < 2) throw new Error('Set ADMIN_NAME to create a new admin account.');
  if (password.length < 12) throw new Error('A new admin password must be at least 12 characters.');

  await User.create({
    name,
    email,
    password,
    roles: ['guest'],
    isAdmin: true,
    role: 'admin',
  });
  console.log('First admin account created. Sign in with ADMIN_EMAIL and ADMIN_PASSWORD.');
}

createFirstAdmin()
  .catch(error => {
    console.error(`Admin setup failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
