const User = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const env = require('dotenv');
const {sendmail} = require("./nodemailer")

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
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please sign up.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { userpass: user.password, email: user.email }, 
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return res.status(200).json({
            message: 'Login successful!',
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

async function HandleAuth(req , res){
  res.json({ message: 'You can access the app!' });
}




module.exports = {HandleAddUser , HandleVerify , HandleAuth};







/*async function HandleGetAll(req, res) {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ error: "Failed to retrieve Users" });
  }
}

async function HandleAdd(req, res) {
  try {
    const { name, house } = req.body;
    const newUser = new User({
      name,
      house
    });
    await newUser.save();
    res.status(200).send({ message: "User created successfully" });
  } catch (error) {
    res.status(404).send(error);
  }
}

async function HandleUpdateUser(req, res) {
  try {
    const name = req.params.name;
    const updatedUser = await User.findOneAndUpdate(
      { name: name },
      { name: req.body.name, house: req.body.house }, 
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(404).send(error);
  }
}

async function HandleDeleteUser(req, res) {
  try {
    const name = req.params.name;
    const deletedUser = await User.findOneAndDelete({ name: name });

    if (deletedUser) {
      res.status(200).json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(404).json({ error: "Error deleting User", err });
  }
}

module.exports = { HandleGetAll, HandleAdd, HandleUpdateUser, HandleDeleteUser };*/
