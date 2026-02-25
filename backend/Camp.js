const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
  name: String,
  location: { lat: Number, lng: Number, address: String },
  capacity: { total: Number, currentOccupancy: Number },
  inventory: [{ item: String, quantity: Number, unit: String, status: String }],
  priorityScore: { type: Number, default: 0 }
});

module.exports = mongoose.model('Camp', CampSchema);