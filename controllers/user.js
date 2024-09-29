const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const {sendmail} = require("../utils/nodemailer")
const cloudinary = require("../utils/cloudnary");
const fs = require('fs');
const path = require('path')
const Education = require("../models/userEducation");
const Skills = require("../models/userSkill");
const WorkExperience = require("../models/userPreviousWork");


env.config();
const Salt = process.env.Salt; 
const JWT_SECRET = process.env.jwt;

async function AddUser(req, res) {
  const { email, password } = req.body;

    try {
      
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).send('User already exists. Please login.');
        }

        // Directly hash the password with salt rounds
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with hashed password
        user = new User({
            email,
            password: hashedPassword
        });

        // Save the user to the database
        await user.save();

        // After signup, redirect to the login page
        sendmail(email);
        res.status(201).send('User registered successfully. Please login.');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

async function Verifyuser(req, res) {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

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
        profileImageUrl: user.profileImageUrl,
        name: user.name,
        headline: user.headline,
        contact: user.contact,
        resume: user.resume,
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
    console.error('Error in HandleVerify:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Handle profile image upload/update
async function Updateuserpfp(req, res) {
  const userEmail = req.user.email;  // Use email from the decoded JWT
  try {
      // Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Proceed with profile picture handling logic...
      // Ensure the file is uploaded
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded.' });
      }

      // Upload the image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'profile_pictures',  // Optional folder name in Cloudinary
      });

      // Delete the local file after uploading to Cloudinary
      fs.unlinkSync(req.file.path);

      // If the user already has a profile image, delete the old one from Cloudinary
      if (user.profileImageUrl) {
          const oldImagePublicId = path.basename(user.profileImageUrl, path.extname(user.profileImageUrl));
          await cloudinary.uploader.destroy(`profile_pictures/${oldImagePublicId}`);
      }

      // Update the user's profile image URL in the database
      user.profileImageUrl = result.secure_url;
      await user.save();

      res.status(200).json({
          message: 'Profile image uploaded/updated successfully.',
          imageUrl: user.profileImageUrl,
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


//updating name
async function updateUserName(req, res) {
  const userEmail = req.user.email;
  const { name } = req.body;

  try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (!name) {
          return res.status(400).json({ message: 'Name is required.' });
      }

      user.name = name;
      await user.save();

      res.status(200).json({
          message: 'User name updated successfully.',
          name: user.name
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

//updating headline

async function updateUserHeadline(req, res) {
  const userEmail = req.user.email;
  const { headline } = req.body;

  try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (!headline) {
          return res.status(400).json({ message: 'Headline is required.' });
      }

      user.headline = headline;
      await user.save();

      res.status(200).json({
          message: 'User headline updated successfully.',
          headline: user.headline
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}

// updating contact

async function updateUserContact(req, res) {
  const userEmail = req.user.email;
  const { contact } = req.body;

  try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (!contact) {
          return res.status(400).json({ message: 'Contact is required.' });
      }

      user.contact = contact;
      await user.save();

      res.status(200).json({
          message: 'User contact updated successfully.',
          contact: user.contact
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


//update resume

async function updateUserResume(req, res) {
  const userEmail = req.user.email;
  const { resume } = req.body;

  try {
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      if (!resume) {
          return res.status(400).json({ message: 'Resume URL is required.' });
      }

      user.resume = resume;
      await user.save();

      res.status(200).json({
          message: 'User resume updated successfully.',
          resume: user.resume
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}


//adding work exp

async function addWorkExperience(req, res) {
    const { companyName, jobTitle, duration, description } = req.body;
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Validate required fields
      if (!companyName || !jobTitle || !duration || !description) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Create a new work experience entry
      const newWorkExperience = new WorkExperience({
        parent_ID: userId,  // Link the work experience entry to the user
        companyName,
        jobTitle,
        duration,
        description
      });
  
      // Save the new work experience entry
      await newWorkExperience.save();
  
      res.status(200).json({
        message: 'Work experience entry added successfully.',
        workExperience: newWorkExperience
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

//deleting work exp


async function deleteWorkExperience(req, res) {
    const workExperienceId = req.params.WEI;  // Get the work experience ID from the request parameters
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Find the work experience entry by its ID and ensure it belongs to the authenticated user
      const workExperience = await WorkExperience.findOneAndDelete({ companyName: workExperienceId, parent_ID: userId });
  
      if (!workExperience) {
        return res.status(404).json({ message: 'Work experience entry not found or does not belong to the user.' });
      }
  
      res.status(200).json({
        message: 'Work experience entry deleted successfully.',
        workExperience: workExperience
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }




  //skill add


  async function addSkill(req, res) {
    const { name } = req.body;
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Validate required field
      if (!name) {
        return res.status(400).json({ message: 'Skill name is required.' });
      }
  
      // Create a new skill entry
      const newSkill = new Skills({
        parent_ID: userId,  // Link the skill entry to the user
        name
      });
  
      // Save the new skill entry
      await newSkill.save();
  
      res.status(200).json({
        message: 'Skill added successfully.',
        skill: newSkill
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  } 



  //skill deleter

  // Function to delete a skill by ID
async function deleteSkill(req, res) {
    const skillname = req.params.skill;  // Get the skill ID from the request parameters
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Find the skill entry by its ID and ensure it belongs to the authenticated user
      const skill = await Skills.findOneAndDelete({ name: skillname, parent_ID: userId });
  
      if (!skill) {
        return res.status(404).json({ message: 'Skill not found or does not belong to the user.' });
      }
  
      res.status(200).json({
        message: 'Skill deleted successfully.',
        skill: skill
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }



  //Education
  async function addEducation(req, res) {
    const { institutionName, degree, fieldOfStudy, startDate, endDate } = req.body;
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Validate required fields
      if (!institutionName || !degree || !fieldOfStudy || !startDate || !endDate) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Create a new education entry
      const newEducation = new Education({
        parent_ID: userId,  // Link the education entry to the user
        institutionName,
        degree,
        fieldOfStudy,
        startDate,
        endDate
      });
  
      // Save the new education entry
      await newEducation.save();
  
      res.status(200).json({
        message: 'Education entry added successfully.',
        education: newEducation
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }

  //delete education

  async function deleteEducation(req, res) {
    const educationId = req.params.EDUC;  // Get the education ID from the request parameters
    const userId = req.user._id;  // Assuming the authenticated user's ID is available from req.user
  
    try {
      // Find the education entry by its ID and make sure it belongs to the authenticated user
      const education = await Education.findOneAndDelete({ institutionName: educationId, parent_ID: userId });
  
      if (!education) {
        return res.status(404).json({ message: 'Education entry not found or does not belong to the user.' });
      }
  
      res.status(200).json({
        message: 'Education entry deleted successfully.',
        education: education
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
  
async function DeleteUser(req, res) {
  const userEmail = req.user.email; // Use email from the decoded JWT

  try {
      // Find the user by email
      const user = await User.findOne({ email: userEmail });
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Delete the user
      await user.remove();

      res.status(200).json({
          message: 'User deleted successfully.'
      });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
}







module.exports = { AddUser , Verifyuser , Updateuserpfp , 
   updateUserName , updateUserHeadline , updateUserContact , 
   updateUserResume , addEducation , deleteEducation, addSkill , deleteSkill , addWorkExperience , deleteWorkExperience, DeleteUser};
