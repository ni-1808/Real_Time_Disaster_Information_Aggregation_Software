const mongoose = require('mongoose');

const droneDataSchema = new mongoose.Schema({
  droneId: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number],
    altitude: Number
  },
  status: { type: String, enum: ['active', 'inactive', 'emergency'], default: 'active' },
  batteryLevel: Number,
  cameraFeed: String, // URL to live stream
  detectedAnomalies: [{
    type: String,
    confidence: Number,
    timestamp: Date,
    imageUrl: String
  }],
  assignedArea: String,
  lastUpdate: { type: Date, default: Date.now }
}, { timestamps: true });

droneDataSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('DroneData', droneDataSchema);