import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import {Role} from '../Enums/role.js';

const adminSchema = new Schema({

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
    },
    role : {
        type: String,
        default: Role.ADMIN,
        immutable: true,
    },
  
});
 
function validateEmail(email){
    // regex for email validation
    const regex = /\S+@\S+\.\S+/;
    return regex.test(email);
}



const Admin = mongoose.model('Admin', adminSchema);

 
export default Admin;