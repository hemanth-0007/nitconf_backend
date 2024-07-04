import mongoose from 'mongoose';
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

const OtpAuth = mongoose.model('OtpAuth', OtpAuthSchema);

export default OtpAuth;