// server/models/ActivityLog.js
const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true }, // e.g., 'suspend_user', 'approve_property'
    targetModel: { type: String }, // optional model name
    targetId: { type: mongoose.Schema.Types.ObjectId }, // optional target document id
    details: { type: mongoose.Schema.Types.Mixed }, // any extra info
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
