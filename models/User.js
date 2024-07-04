import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {Role} from '../Enums/role.js';

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
        lowercase: true,
        validate:{
            validator: validateEmail,
            message: props => `${props.value} is not a valid email!`
        }
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

function validateEmail(email){
    // regex for email validation
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}


const User = mongoose.model('User', userSchema);

 
export default User;