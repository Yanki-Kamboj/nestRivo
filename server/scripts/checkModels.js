const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Load all models
const models = [
  require('../models/User'),
  require('../models/Property'),
  require('../models/Booking'),
  require('../models/Review'),
  require('../models/Wishlist'),
  require('../models/Conversation'),
  require('../models/Message'),
  require('../models/Notification'),
  require('../models/Transaction'),
  require('../models/Category'),
  require('../models/PlatformSettings'),
  require('../models/ActivityLog'),
];

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nestrivo_check';

(async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    for (const model of models) {
      await model.syncIndexes();
      console.log(`Indexes synced for ${model.modelName}`);
    }
    console.log('All indexes synced successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error during index sync:', err.message);
    process.exit(1);
  }
})();
