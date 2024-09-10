const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('dotenv');
const {sendmail} = require("../utils/nodemailer")
const cloudinary = require("../utils/cloudnary");
const fs = require('fs');
const path = require('path')

env.config();
const Salt = process.env.Salt; 
const JWT_SECRET = process.env.jwt;

async function HandleAddUser(req, res) {
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

async function HandleVerify(req, res) {
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
      { email: user.email, _id: user._id }, // Payload with email and user ID for security
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
async function HandleAuth(req, res) {
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





module.exports = {HandleAddUser , HandleVerify , HandleAuth};
