const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: { type: String, required: true, minlength: 6 },
    role: {
        type: String,
        enum: ['volunteer', 'admin', 'super_admin'],
        default: 'volunteer'
    },
    volunteerRole: {
        type: String,
        enum: ['medical', 'cooking', 'driving', 'construction', 'translation']
    },
    skills: [{ type: String }],
    status: {
        type: String,
        enum: ['Available', 'On-Mission', 'Resting'],
        default: 'Available'
    },
    currentLocation: {
        type: { type: String, default: 'Point' },
        coordinates: [Number]
    },
    phone: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password helper
UserSchema.methods.matchPassword = async function (entered) {
    return bcrypt.compare(entered, this.password);
};

// Strip password from JSON output
UserSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

module.exports = mongoose.model('User', UserSchema);
