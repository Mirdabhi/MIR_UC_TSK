const mongoose = require('mongoose');

  

  const skillSchema = new Schema({
    parent_ID :{
        type: String
    },
    name: { type: String, required: true }
  });
  
  const Skill = mongoose.model('Skill', skillSchema);
  module.exports = Skill;
  