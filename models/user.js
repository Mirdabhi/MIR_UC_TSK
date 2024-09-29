const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {  
    type: String,
    required: true, 
    unique: true 
},
  password: { 
    type: String, 
    required: true 
},
profileImageUrl: { 
    type: String,
    default: null
},  
name: {
  type: String,
  default: null
},
headline: {
  type: String,
  default: null
},
contact: {
  type: String, // You can modify this based on whether it's phone, email, etc.
  default: null
},
resume: {
  type: String, // Assuming this would be a URL to the resume PDF or document
  default: null
}

});

 const User = mongoose.model('User', userSchema);
module.exports = User;
