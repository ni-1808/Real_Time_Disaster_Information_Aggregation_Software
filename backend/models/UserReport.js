const mongoose = require('mongoose');

const userReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  description: { type: String, required: true },
  hashtags: [String],
  images: [String],
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  verified: { type: Boolean, default: false },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mlClassification: {
    isAuthentic: Boolean,
    confidence: Number,
    riskLevel: String,
    reasoning: [String]
  }
}, { timestamps: true });

userReportSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('UserReport', userReportSchema);