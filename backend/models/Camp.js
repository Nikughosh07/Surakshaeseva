const mongoose = require('mongoose');

const CampSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  capacity: {
    total: Number,
    currentOccupancy: Number
  },
  // Dynamic inventory to track shortages
  inventory: [{
    item: String,
    quantity: Number,
    unit: String, // e.g., "liters", "units", "kg"
    status: { type: String, enum: ['Critical', 'Low', 'Stable'], default: 'Stable' }
  }],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Camp', CampSchema);
