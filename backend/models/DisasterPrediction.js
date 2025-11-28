const mongoose = require('mongoose');

const disasterPredictionSchema = new mongoose.Schema({
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    address: String
  },
  disasterType: String,
  probability: Number, // 0-100
  predictedDate: Date,
  factors: [String], // Weather patterns, historical data, etc.
  confidence: { type: String, enum: ['low', 'medium', 'high'] },
  aiModel: String,
  status: { type: String, enum: ['predicted', 'occurred', 'false_alarm'], default: 'predicted' }
}, { timestamps: true });

disasterPredictionSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DisasterPrediction', disasterPredictionSchema);