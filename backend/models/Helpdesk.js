const mongoose = require('mongoose');

const helpdeskSchema = new mongoose.Schema({
  state: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  email: String,
  services: [String]
});

module.exports = mongoose.model('Helpdesk', helpdeskSchema);