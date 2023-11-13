const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["customer", "rider"],
        default: 'customer'
    }
}, { timestamps: true });

const userModel = mongoose.model('users', userSchema);

module.exports = {
    userModel
};