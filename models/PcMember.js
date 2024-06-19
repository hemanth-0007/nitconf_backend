const mongoose = require('mongoose');
const { required } = require('nodemon/lib/config');
const Schema = mongoose.Schema;

const PcMemberSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,   
    },
    email: {
        type: String,
        required: true,
        unique: true,   // much important
    },
    password: {
        type: String,
        required: true,
    },
    role :{
        type: String,
        required: true,
        default: process.env.PC_MEMBER_ROLE
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role : {
        type: String,
        default: Role.PC_MEMBER,
        enum: {
            values: [Role.AUTHOR, Role.REVIEWER, Role.PC_MEMBER],
            message: '{VALUE} is not supported'
        },
        immutable: true,
    },
});


const PcMember = mongoose.model('PcMember', PcMemberSchema);

 
module.exports = PcMember;