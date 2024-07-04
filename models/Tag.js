import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tagSchema = new Schema({
    title : {
        type : String,
        required : true,
        unique : true
    }
});

const Tag = mongoose.model('Tag', tagSchema);
export default Tag;