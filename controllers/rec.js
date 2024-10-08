const Recruiter = require("../models/recr");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const fs = require('fs');
const path = require('path');
const Company = require("../models/company");


env.config();
async function AddREC(req, res) {
    const { email, password, current_position, name, companyId } = req.body;
  
    try {
        // Check if the company ID exists in the Company collection
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(400).json({ message: 'Invalid company ID. Recruiter cannot be created.' });
        }
  
        // Check if the recruiter already exists
        let recruiter = await Recruiter.findOne({ email });
        if (recruiter) {
            return res.status(400).send('User already exists. Please login.');
        }
  
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new recruiter with the company ID reference
        recruiter = new Recruiter({
            email,
            password: hashedPassword,
            current_position,
            name,
            company: companyId // Reference to the company
        });
  
        // Save the recruiter to the database
        await recruiter.save();
  
        // Send confirmation email after signup
        sendmail(email);
        res.status(201).send('User registered successfully. Please login.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
}


  async function Verifyrec(req, res) {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const user = await Recruiter.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found. Please sign up.' });
      }
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the user's email and user ID
      const token = jwt.sign(
        { email: user.email, _id: user._id ,
          name: user.name,
          current_position : user.current_position,
          company: companyId,
         
         
        }, // Payload with email and user ID for security
        JWT_SECRET,                          // Secret key from environment variables
        { expiresIn: '1000h' }              // Token expiration time
      );
  
      // Send the token back to the client
      return res.status(200).json({
        message: 'Login successful!',
        token: token
      });
  
    } catch (error) {
      console.error('Error in HandleVerify:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  async function deleteRecruiter(req, res) {
    const userEmail = req.user.email;
  
    try {
      // Find and delete the recruiter by email
      const recruiter = await Recruiter.findOneAndDelete({ email: userEmail });
  
      if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found.' });
      }
  
      res.status(200).json({ message: 'Recruiter deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  
  async function updateRecruiterName(req, res) {
    const userEmail = req.user.email;
    const { name } = req.body;
  
    try {
      const recruiter = await Recruiter.findOne({ email: userEmail });
  
      if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found.' });
      }
  
      if (!name) {
        return res.status(400).json({ message: 'Name is required.' });
      }
  
      recruiter.name = name;
      await recruiter.save();
  
      res.status(200).json({
        message: 'Recruiter name updated successfully.',
        name: recruiter.name
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async function updateRecruiterPosition(req, res) {
    const userEmail = req.user.email;
    const { current_position } = req.body;
  
    try {
      const recruiter = await Recruiter.findOne({ email: userEmail });
  
      if (!recruiter) {
        return res.status(404).json({ message: 'Recruiter not found.' });
      }
  
      if (!current_position) {
        return res.status(400).json({ message: 'Current position is required.' });
      }
  
      recruiter.current_position = current_position;
      await recruiter.save();
  
      res.status(200).json({
        message: 'Recruiter current position updated successfully.',
        current_position: recruiter.current_position
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  

  module.exports = {AddREC , Verifyrec , updateRecruiterPosition , updateRecruiterName , deleteRecruiter};