const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  headline: { type: String, required: true },
  category: String,
  region: String,
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'] },
  link: String,
  source: String,
  content: String
}, { timestamps: true });

module.exports = mongoose.model('News', newsSchema);