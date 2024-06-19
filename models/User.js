const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Role = require('../utility/role');

const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,     
        immutable: true,
    },
    password: {
        type: String,
        required: true,
        // immutable: true,  // not required
    },
    isVerified: {
        type: Boolean,
        default: false,
        // required: true
    },
    papers: [{
        type: Schema.Types.ObjectId,
        ref: 'Paper',
        default: [],
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    role : {
        type: String,
        default: Role.AUTHOR,
        enum: {
            values: [Role.AUTHOR, Role.REVIEWER, Role.PC_MEMBER],
            message: '{VALUE} is not supported'
        },
        immutable: true,
    },
});


const User = mongoose.model('User', userSchema);

 
module.exports = User;