const mongoose = require('mongoose');

const CrowdReportSchema = new mongoose.Schema({
  type: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  photo: { type: String, default: '' }, // path to uploaded file
  reportedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CrowdReport', CrowdReportSchema);
