const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const jobSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    requirements: [{ 
        type: String 
    }], // Array of strings to store job requirements
    salary_range: { 
        type: String 
    },
    location: { 
        type: String 
    },
    job_type: { 
        type: String, 
        enum: ['full-time', 'part-time', 'remote'], // Specify job types
        required: true
    },
    recruiter_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Recruiter', // Reference to the Recruiter model
        required: true
    },
    company_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', // Reference to the Company model
        required: true
    }
}
);

const Job = mongoose.model('Job', jobSchema);
module.exports = Job;
