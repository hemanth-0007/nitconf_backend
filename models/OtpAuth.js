const middlewareWrapper = require('cors');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OtpAuthSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('OtpAuth', OtpAuthSchema);