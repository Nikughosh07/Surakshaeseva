const express = require('express');
const router = express.Router();
const Volunteer = require('../models/Volunteer');

// POST: Find matching volunteers for a camp's specific need
router.post('/find-match', async (req, res) => {
  const { campLocation, requiredSkill, maxDistanceKm } = req.body;

  try {
    const matches = await Volunteer.find({
      status: 'Available',
      skills: requiredSkill, // Matches if the array contains this skill
      currentLocation: {
        $near: {
          $geometry: { type: "Point", coordinates: campLocation }, // [lng, lat]
          $maxDistance: maxDistanceKm * 1000 // Convert km to meters
        }
      }
    }).limit(10); // Keep it manageable for the coordinator

    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: "Matching error: " + err.message });
  }
});

module.exports = router;