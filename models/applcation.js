const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Application schema
const applicationSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema
    required: true
  },
  job_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job', // Reference to the Job schema
    required: true
  },
  status: {
    type: String,
    // Valid status values
    default: 'pending'
  },
  applied_date: {
    type: Date,
    default: Date.now // Sets the default date to the time of application creation
  }
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
