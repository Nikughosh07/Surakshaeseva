const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
    donor: { type: String, default: 'Anonymous' },
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'units' },
    destinationCamp: { type: mongoose.Schema.Types.ObjectId, ref: 'Camp' },
    status: {
        type: String,
        enum: ['Pledged', 'In Transit', 'Delivered'],
        default: 'Pledged'
    },
    estimatedDelivery: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Donation', DonationSchema);
