const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: { type: String, required: true }, // earthquake, flood, weather
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number], // [lng, lat]
    address: String
  },
  magnitude: Number,
  description: String,
  source: String,
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Alert', alertSchema);