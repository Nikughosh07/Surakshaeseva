const express = require('express');
const router = express.Router();
const Camp = require('./Camp');
const User = require('./models/User');
const Donation = require('./Donation');
const Task = require('./Task');
const MissingPerson = require('./MissingPerson');
const CrowdReport = require('./CrowdReport');

// multer for handling photo uploads
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ─── CAMPS ──────────────────────────────────────────────────────────────────

router.get('/camps', async (req, res) => {
  try {
    const camps = await Camp.find();
    res.json(camps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/camps/:id', async (req, res) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/camps/:id/inventory', async (req, res) => {
  try {
    const { item, quantity } = req.body;
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });
    const inv = camp.inventory.find(i => i.item === item);
    if (inv) {
      inv.quantity = quantity;
      inv.status = quantity < 20 ? 'Critical' : 'Stable';
    }
    // Recompute priority score
    const criticalCount = camp.inventory.filter(i => i.status === 'Critical').length;
    camp.priorityScore = Math.min(100, criticalCount * 25);
    await camp.save();
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/camps/:id/capacity', async (req, res) => {
  try {
    const { total, currentOccupancy } = req.body;
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });

    if (total !== undefined) camp.capacity.total = total;
    if (currentOccupancy !== undefined) camp.capacity.currentOccupancy = currentOccupancy;

    await camp.save();
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/camps/:id/inventory-item', async (req, res) => {
  try {
    const { item, quantity, unit } = req.body;
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ message: 'Camp not found' });

    const invIndex = camp.inventory.findIndex(i => i.item.toLowerCase() === item.toLowerCase());
    if (invIndex !== -1) {
      // Update existing item
      camp.inventory[invIndex].quantity = quantity;
      if (unit) camp.inventory[invIndex].unit = unit;
      camp.inventory[invIndex].status = quantity < 20 ? 'Critical' : 'Stable';
    } else {
      // Add new item
      camp.inventory.push({
        item,
        quantity,
        unit: unit || 'units',
        status: quantity < 20 ? 'Critical' : 'Stable'
      });
    }

    // Recompute priority score
    const criticalCount = camp.inventory.filter(i => i.status === 'Critical').length;
    camp.priorityScore = Math.min(100, criticalCount * 25);
    await camp.save();
    res.json(camp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── VOLUNTEERS ──────────────────────────────────────────────────────────────

router.get('/volunteers', async (req, res) => {
  try {
    const { skill, status } = req.query;
    const filter = { role: 'volunteer' };
    if (skill) filter.skills = skill;
    if (status) filter.status = status;
    const volunteers = await User.find(filter);
    res.json(volunteers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/volunteers', async (req, res) => {
  try {
    // Legacy support for volunteer panel
    const volunteer = new User({ ...req.body, role: 'volunteer' });
    // Assuming password isn't provided through this endpoint, let's set a dummy one
    // In production, the admin panel should either require a password or send a registration email
    volunteer.password = 'tempPassword123';
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/volunteers/:id/status', async (req, res) => {
  try {
    const { status, currentLocation } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (currentLocation) updateData.currentLocation = currentLocation;

    const volunteer = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(volunteer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── TASKS ───────────────────────────────────────────────────────────────────

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('camp', 'name').populate('assignedTo', 'name skills');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/volunteers/:id/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.id })
      .populate('camp', 'name')
      .populate('assignedTo', 'name skills')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/tasks', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    await task.populate('camp', 'name');
    await task.populate('assignedTo', 'name skills');
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/tasks/:id/status', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('camp', 'name').populate('assignedTo', 'name');
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── STATS / ADMIN ──────────────────────────────────────────────────────────

router.get('/stats', async (req, res) => {
  try {
    const [camps, volunteers, tasks, donations] = await Promise.all([
      Camp.find(),
      User.find({ role: 'volunteer' }),
      Task.find(),
      Donation.find()
    ]);

    const criticalCamps = camps.filter(c => c.priorityScore > 50);
    const availableVols = volunteers.filter(v => v.status === 'Available');
    const onMissionVols = volunteers.filter(v => v.status === 'On-Mission');
    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedTasks = tasks.filter(t => t.status === 'Completed');
    const deliveredDonations = donations.filter(d => d.status === 'Delivered');

    // Aggregate supply totals
    const supplyTotals = {};
    camps.forEach(camp => {
      camp.inventory.forEach(inv => {
        if (!supplyTotals[inv.item]) supplyTotals[inv.item] = 0;
        supplyTotals[inv.item] += inv.quantity;
      });
    });

    res.json({
      totalCamps: camps.length,
      criticalCamps: criticalCamps.length,
      totalVolunteers: volunteers.length,
      availableVolunteers: availableVols.length,
      onMissionVolunteers: onMissionVols.length,
      totalTasks: tasks.length,
      pendingTasks: pendingTasks.length,
      completedTasks: completedTasks.length,
      supplyTotals,
      totalDonations: donations.length,
      deliveredDonations: deliveredDonations.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DONATIONS ───────────────────────────────────────────────────────────────

router.get('/donations', async (req, res) => {
  try {
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .populate('destinationCamp', 'name');
    res.json(donations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/donations', async (req, res) => {
  try {
    const donation = new Donation(req.body);
    await donation.save();
    await donation.populate('destinationCamp', 'name');
    res.status(201).json(donation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/donations/:id/status', async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('destinationCamp', 'name');
    res.json(donation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── MISSING PERSONS ─────────────────────────────────────────────────────────

// anyone can report a missing person with an optional photo
router.get('/missing-persons', async (req, res) => {
  try {
    const list = await MissingPerson.find().sort({ reportedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CROWD REPORTS (community input) ───────────────────────────────────────────
router.get('/crowd-reports', async (req, res) => {
  try {
    const list = await CrowdReport.find().sort({ reportedAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/crowd-reports', upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    // convert location lat/lng strings into numbers
    if (data['location[lat]'] || data['location.lat']) {
      const lat = parseFloat(data['location[lat]'] || data['location.lat']);
      const lng = parseFloat(data['location[lng]'] || data['location.lng']);
      data.location = { lat, lng };
      delete data['location[lat]'];
      delete data['location[lng]'];
      delete data['location.lat'];
      delete data['location.lng'];
    }
    if (req.file) {
      data.photo = `/uploads/${req.file.filename}`;
    }
    const r = new CrowdReport(data);
    await r.save();
    res.status(201).json(r);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/missing-persons/:id', async (req, res) => {
  try {
    const mp = await MissingPerson.findById(req.params.id);
    if (!mp) return res.status(404).json({ message: 'Not found' });
    res.json(mp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/missing-persons', upload.single('photo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.photo = `/uploads/${req.file.filename}`;
    }
    const mp = new MissingPerson(data);
    await mp.save();
    res.status(201).json(mp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;