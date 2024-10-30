const Company = require("../models/company");
const Recruiter = require("../models/recr");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const {sendmail} = require("../utils/nodemailer")
const cloudinary = require("../utils/cloudnary");
const fs = require('fs');
const path = require('path')
const FollowerFollowing = require('../models/follower'); // Import FollowerFollowing model
const User = require("../models/user");

env.config();
const JWT_SECRET = process.env.jwt;

async function AddCompany(req, res) {
const { email, password, companyName , companyWebsite, companyIntake, companyDomain, companyLocation, establishedDate, description } = req.body;
  
try {
    // Check if the company already exists by email
    let company = await Company.findOne({ email });
    if (company) {
        return res.status(400).send('Company already exists. Please login.');
    }

    // Hash the password with bcrypt (salt rounds: 10)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new company with the provided information and hashed password
    company = new Company({
        email,
        password: hashedPassword,
        companyName,
        companyWebsite,
        companyIntake,
        companyDomain,
        companyLocation,
        establishedDate,
        description,
    });

    // Save the new company to the database
    await company.save();

    // Send confirmation email
    sendmail(email);

    // Send a success response
    res.status(201).send('Company registered successfully. Please login.');
} catch (err) {
    console.error(err);
    res.status(500).send('Server error');
}
}  

  async function VerifyCompany(req, res) {
    const { email, password } = req.body;
  
    try {
      // Find the user by email
      const company = await Company.findOne({ email });
  
      if (!company) {
        return res.status(404).json({ message: 'Company not found. Please sign up.' });
      }
  
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, company.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Create a JWT token with the user's email and user ID
      const token = jwt.sign(
        { email: company.email, _id: company._id , 
          companyName: company.companyName,
          companyWebsite : company.companyWebsite,
          companyIntake : company.companyIntake,
          companyDomain : company.companyDomain, 
          companyLocation : company.companyLocation,
          establishedDate : company.establishedDate,
          companySize : company.companySize,
         }, // Payload with email and user ID for security
        JWT_SECRET,                          // Secret key from environment variables
        { expiresIn: '1h' }                  // Token expiration time
      );
  
      // Send the token back to the client
      return res.status(200).json({
        message: 'Login successful!',
        token: token
      });
  
    } catch (error) {
      console.error('Error in Verify:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }




  
  // COMPANY WEBSITE UPDATE




  async function updateCompanyWebsite(req, res) {
    const userEmail = req.user.email;  // Use email from the decoded JWT
    const { companyWebsite } = req.body;

    try {
        // Find the user by email
        const company = await Company.findOne({ email: userEmail });
        if (!company) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Validate the input
        if (!companyWebsite) {
            return res.status(400).json({ message: 'Company website is required.' });
        }

        // Update the company website
        company.companyWebsite = companyWebsite;
        await company.save();

        res.status(200).json({
            message: 'Company website updated successfully.',
            companyWebsite: user.companyWebsite
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

//UPDATE COMPANY NAME



async function updateCompanyName(req, res) {
  const userEmail = req.user.email;
  const { companyName } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!companyName) {
          return res.status(400).json({ message: 'Company name is required.' });
      }

      company.companyName = companyName;
      await company.save();

      res.status(200).json({
          message: 'Company name updated successfully.',
          companyName: company.companyName
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

// COMPANY DOMAIN


async function updateCompanyDomain(req, res) {
  const userEmail = req.user.email;
  const { companyDomain } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!companyDomain) {
          return res.status(400).json({ message: 'Company domain is required.' });
      }

      company.companyDomain = companyDomain;
      await company.save();

      res.status(200).json({
          message: 'Company domain updated successfully.',
          companyDomain: company.companyDomain
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

//CompanyDsecription


async function updateCompanyDescription(req, res) {
  const userEmail = req.user.email;
  const { description } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!description) {
          return res.status(400).json({ message: 'Description is required.' });
      }

      company.description = description;
      await company.save();

      res.status(200).json({
          message: 'Company description updated successfully.',
          description: company.description
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}



//company location update

async function updateCompanyLocation(req, res) {
  const userEmail = req.user.email;
  const { companyLocation } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!companyLocation) {
          return res.status(400).json({ message: 'Company location is required.' });
      }

      company.companyLocation = companyLocation;
      await company.save();

      res.status(200).json({
          message: 'Company location updated successfully.',
          companyLocation: company.companyLocation
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


//companyINTAKE UPDATE


async function updateCompanyIntake(req, res) {
  const userEmail = req.user.email;
  const { companyIntake } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!companyIntake || isNaN(companyIntake)) {
          return res.status(400).json({ message: 'A valid company intake number is required.' });
      }

      company.companyIntake = companyIntake;
      await company.save();

      res.status(200).json({
          message: 'Company intake updated successfully.',
          companyIntake: company.companyIntake
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


//COMPANY ESTABILISHED DATE UPDATE

async function updateEstablishedDate(req, res) {
  const userEmail = req.user.email;
  const { establishedDate } = req.body;

  try {
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }

      if (!establishedDate) {
          return res.status(400).json({ message: 'Established date is required.' });
      }

      company.establishedDate = new Date(establishedDate);
      await company.save();

      res.status(200).json({
          message: 'Established date updated successfully.',
          establishedDate: company.establishedDate
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

//deleting 

async function deleteCompany(req, res) {
  const userEmail = req.user.email;  // Use email from the decoded JWT
  const id = req.user._id;
  try {
      // Find the company by email
      const company = await Company.findOne({ email: userEmail });
      if (!company) {
          return res.status(404).json({ message: 'Company not found.' });
      }


      await Recruiter.deleteMany({ company_id: id });
      // Delete the company
      await company.remove();

      res.status(200).json({
          message: 'Company deleted successfully.'
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


  
  
  
  
  
  module.exports = {updateCompanyDescription, 
    updateCompanyDomain,
    updateCompanyWebsite,
    updateEstablishedDate,
    updateCompanyIntake, 
    updateCompanyLocation,
    updateCompanyName,
    deleteCompany,
    AddCompany,
    VerifyCompany
  };
  