const mongoose= require('mongoose')

const NotesSchema = new Schema({
   title:{
    type:String,
    require:true
   },
   description:{
    type:String,
    require:true
   },
   
   tag:{
    type:String,
   },
   date:{
    type:Date,
    default: Date.now
   }
  });

//   Expoting models
  module.exports= mongoose.model('notes',NotesSchema);
