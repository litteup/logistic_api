const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    destinationAddress: {
        type: String,
        required: true,
    },
    itemWeight: {
        type: Number,
        required: true,
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
    },
    riderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    cost: {
        type: Number,
        default: 1000
    },
    status: {
        type: String,
        enum: ['pending', 'in-transit', 'delivered'],
        defalt: 'pending'
    }
}, { timestamps: true });

const shippingModel = mongoose.model('orders', orderSchema);

module.exports = {
    shippingModel
};