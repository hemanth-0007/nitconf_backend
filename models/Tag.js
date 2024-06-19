const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    }
});

module.exports = mongoose.model('Tag', tagSchema);