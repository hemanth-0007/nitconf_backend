import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const documentSchema = new Schema({
    reviews : [{
        type : Schema.Types.ObjectId,
        ref : 'Review',
        default : []
    }],
    original_name : {
        type : String,
        // minLength : [5, 'Name is too short'],
        // maxLength : [50, 'Name is too long'],
        required : true
    },
    file : {
    //type is a pdf file
        type : Buffer,
        required : true
    },
    changes_description : {
        type : String,
        // minLength : [20, 'Description is too short'],
        // maxLength : [200, 'Description is too long'],
        required : true
    },
    updated_at : {
        type : Date,
        required : true,
    },
});

const Document = mongoose.model('Document', documentSchema);
export default Document;