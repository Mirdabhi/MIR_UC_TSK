const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    email: {  
        type: String,
        required: true, 
        unique: true 
    },
      password: { 
        type: String, 
        required: true 
    },
    companyName: {
      type: String,
      required: true,
      unique: true
    },
    companyWebsite: {
      type: String,
      required: true
    },
    companyIntake: {
      type: Number,  // Assuming "intake" refers to the number of employees or team members
      required: true
    },
    companyDomain: {
      type: String,  // The industry or domain the company operates in (e.g., Tech, Healthcare)
      required: true
    },
    companyLocation: {
      type: String,  // The company's headquarters or main office location
      required: true
    },
    establishedDate: {
      type: Date,  // The date when the company was founded
      default: null
    },
    description: {
      type: String,  // A brief description or overview of the company
      default: null
    },
  });

  const Company = mongoose.model('Company', companySchema);
module.exports = Company;
  