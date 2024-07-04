import mongoose from 'mongoose';
const Schema = mongoose.Schema;

import { Status } from '../Enums/status.js';

const paperSchema = new Schema({
    title: {
        type: String,
        required: true,
        // minLength: [4, 'Title must be at least 4 characters long'],
        // maxLength: [50, 'Title must be at most 100 characters long'],
    },
    description: {
        type: String,
        required: true,
        // minLength: [4, 'Title must be at least 4 characters long'],
        // maxLength: [200, 'Title must be at most 100 characters long'],
       
    },
    status : {
        type: String,
        default: Status.PENDING,
        enum: {
            values: [Status.PENDING, Status.ACCEPTED, Status.REJECTED],
            message: '{VALUE} is not supported'
        }
    },
    tags : [{
        type: String,
        // minLength: [10, 'Tag must be at least 1 characters long'],
        // maxLength: [20, 'Tag must be at most 50 characters long'],
        required : true,
        default: [],
    }],
    documents : [{
        type:Schema.Types.ObjectId,
        ref : 'Document',
        default : [],
    }],
    createdAt : {
        type : Date,
        required : true,
    },
    updatedAt : {
        type : Date,
        default : Date.now(),
        required : true,
    },
    author_id : {
        type:Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
});
const Paper = mongoose.model('Paper', paperSchema);

export default Paper;