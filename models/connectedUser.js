const mongoose = require('mongoose');

const connectedUsersSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
});

const connectedUsersModel = mongoose.model('connectedUsers', connectedUsersSchema);

module.exports = {
    connectedUsersModel
}