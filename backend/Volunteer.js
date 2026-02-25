const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  skills: [String],
  status: String,
  currentLocation: { type: { type: String, default: 'Point' }, coordinates: [Number] }
});

VolunteerSchema.index({ currentLocation: '2dsphere' });
module.exports = mongoose.model('Volunteer', VolunteerSchema);