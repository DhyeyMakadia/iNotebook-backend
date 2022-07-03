const mongoose = require('mongoose')
const { Schema } = mongoose;

const NotesSchema = new Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        default:"General"
    },
    date:{
        type:String,
        default:Date.now
    }
});

const Notes = mongoose.model('notes',NotesSchema);
Notes.createIndexes();
module.exports = Notes