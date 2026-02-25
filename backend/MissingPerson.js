const mongoose = require('mongoose');

const MissingPersonSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number },
  lastSeenLocation: { type: String, default: '' },
  lastSeenDate: { type: Date },
  description: { type: String, default: '' },
  photo: { type: String, default: '' }, // URL or path to uploaded file
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('MissingPerson', MissingPersonSchema);
