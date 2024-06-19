const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    body: String,
    user : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    document : {
        type: Schema.Types.ObjectId,
        ref: 'Document'
    },
    paper : {
        type: Schema.Types.ObjectId,
        ref: 'Paper'
    },
    reviewer : {
        type: Schema.Types.ObjectId,
        ref: 'Reviewer'
    },
})

module.exports = mongoose.model('Review', reviewSchema);