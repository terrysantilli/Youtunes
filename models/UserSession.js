const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserSessionSchema = new Schema({
    userId: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

module.exports = Item = mongoose.model('UserSession', UserSessionSchema);