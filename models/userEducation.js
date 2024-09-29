const mongoose = require('mongoose');


const educationSchema = new Schema({
    parent_ID :{
        type: String
    },
    institutionName: { type: String, default: null },
    degree: { type: String, default: null },
    fieldOfStudy: { type: String, default: null },
    startDate: { type: Date },
    endDate: { type: Date }
  });
  
  const Education = mongoose.model('Education', educationSchema);
  module.exports = Education;