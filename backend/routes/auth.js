const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'disaster-relief-secret-key-2024';
const SUPER_ADMIN_KEY = process.env.SUPER_ADMIN_KEY || 'SUPER_SECRET_KEY_2024';

// Generate JWT
const generateToken = (id) =>
    jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

// ─── REGISTER ────────────────────────────────────────────────────────────────

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, volunteerRole, phone, superAdminKey } = req.body;

        // Check if user already exists
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'An account with this email already exists' });
        }

        // Super Admin validation
        if (role === 'super_admin') {
            if (!superAdminKey || superAdminKey !== SUPER_ADMIN_KEY) {
                return res.status(403).json({ message: 'Invalid Super Admin authorization key' });
            }
        }

        // Validate volunteer role
        if (role === 'volunteer' && !volunteerRole) {
            return res.status(400).json({ message: 'Volunteers must select a specialty role' });
        }

        const userData = {
            name,
            email,
            password,
            role: role || 'volunteer',
            phone
        };

        if (userData.role === 'volunteer') {
            userData.volunteerRole = volunteerRole;
            userData.skills = [volunteerRole.charAt(0).toUpperCase() + volunteerRole.slice(1)];
        }

        const user = new User(userData);

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── LOGIN ───────────────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ─── GET CURRENT USER (session restore) ──────────────────────────────────────

router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user });
    } catch (err) {
        res.status(401).json({ message: 'Token invalid or expired' });
    }
});

module.exports = router;
