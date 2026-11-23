const mongoose = require('mongoose');

const hostBlockedDateSchema = new mongoose.Schema({
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  reason: { type: String, trim: true, maxlength: 200, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

hostBlockedDateSchema.index({ property: 1, start: 1, end: 1 });

module.exports = mongoose.model('HostBlockedDate', hostBlockedDateSchema);
