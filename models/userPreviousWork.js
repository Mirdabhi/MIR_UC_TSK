const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const workExperienceSchema = new Schema({
    parent_ID: {
        type: mongoose.Schema.Types.ObjectId,
         ref : "User"
    },
    companyName: { 
        type: String, 
        default: null 
    },
    jobTitle: { 
        type: String, 
        default: null 
    },
    duration: { 
        type: String, 
        default: null 
    },
    description: { 
        type: String 
    }
});

const WorkExperience = mongoose.model('WorkExperience', workExperienceSchema);
module.exports = WorkExperience;
