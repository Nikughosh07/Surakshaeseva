const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: String,
  skills: [String], // e.g., ["Medical", "Heavy Lifting", "Driving", "Cooking"]
  status: { 
    type: String, 
    enum: ['Available', 'On-Mission', 'Inactive'], 
    default: 'Available' 
  },
  // Geospatial indexing for location-based dispatch
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  }
});

// Important: Create a 2dsphere index for proximity queries
VolunteerSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Volunteer', VolunteerSchema);