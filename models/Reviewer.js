const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewerSchema = new Schema({
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
        unique: true,   // much important
    },
    password: {
        type: String,
        required: true,
    },
    expert_at: [{
        type: String,
        default: [],
        // minlength: 10, 
        // maxlength: 100
    }],
    assigned_papers: [{
        type: Schema.Types.ObjectId,
        ref: 'Paper',
        default: [],
    }],
    reviewed_papers: [{
        type: Schema.Types.ObjectId,
        ref: 'Paper',
        default: [],
    }],
    unreviewed_papers: [{
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
        default: Role.REVIEWER,
        enum: {
            values: [Role.AUTHOR, Role.REVIEWER, Role.PC_MEMBER],
            message: '{VALUE} is not supported'
        },
        immutable: true,
    },
});


const Reviewer = mongoose.model('Reviewer', reviewerSchema);

 
module.exports = Reviewer;