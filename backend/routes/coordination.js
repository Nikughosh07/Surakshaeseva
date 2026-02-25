const express = require('express');
const router = express.Router();
const Camp = require('../models/Camp');

// GET: Priority List for Coordinators
router.get('/priority-camps', async (req, res) => {
  try {
    const camps = await Camp.find();
    
    const prioritized = camps.map(camp => {
      // Logic: If occupancy > 90% OR any item is "Critical", set high priority
      const isOvercrowded = (camp.capacity.currentOccupancy / camp.capacity.total) > 0.9;
      const hasCriticalShortage = camp.inventory.some(i => i.status === 'Critical');
      
      return {
        ...camp._doc,
        priorityScore: (isOvercrowded ? 50 : 0) + (hasCriticalShortage ? 50 : 0)
      };
    }).sort((a, b) => b.priorityScore - a.priorityScore);

    res.json(prioritized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;