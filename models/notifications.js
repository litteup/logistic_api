const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sendTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
        required: true
    },
    message: {
        type: String,
        required: true
    }
});

const notificationModel = mongoose.model('notification', notificationSchema);

module.exports = {
    notificationModel
}