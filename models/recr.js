const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Recruiter schema
const recruiterSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  current_position: {
    type: String,
    default: null
  },
   company_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',  // Refers to the Company schema
    required: true
  }
});

const Recruiter = mongoose.model('Recruiter', recruiterSchema);

module.exports = Recruiter;
