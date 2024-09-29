const mongoose = require('mongoose');
const workExperienceSchema = new Schema({
    parent_ID :{
        type: String
    },
    companyName: { type: String, default: null },
    jobTitle: { type: String, default: null },
    duration: { type: String, default: null },
    description: { type: String }
  });
  
  const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);
  module.exports = WorkExperience;