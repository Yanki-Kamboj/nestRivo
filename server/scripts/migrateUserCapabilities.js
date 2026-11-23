require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function migrateUserCapabilities() {
  await mongoose.connect(process.env.MONGODB_URI);
  const users = await User.collection.find(
    {},
    { projection: { _id: 1, role: 1, roles: 1, isAdmin: 1 } }
  ).toArray();

  if (users.length === 0) {
    console.log('No user accounts required migration.');
    return;
  }

  const operations = users.map(user => {
    const roles = new Set((user.roles || []).filter(role => role === 'guest' || role === 'host'));
    roles.add('guest');
    if (user.role === 'host') roles.add('host');
    const isAdmin = Boolean(user.isAdmin || user.role === 'admin');
    const legacyRole = isAdmin ? 'admin' : (roles.has('host') ? 'host' : 'guest');

    return {
      updateOne: {
        filter: { _id: user._id },
        update: { $set: { roles: [...roles], isAdmin, role: legacyRole } },
      },
    };
  });

  const result = await User.collection.bulkWrite(operations);
  console.log(`Migrated capabilities for ${result.modifiedCount} user account(s).`);
}

migrateUserCapabilities()
  .catch(error => {
    console.error('User capability migration failed:', error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
