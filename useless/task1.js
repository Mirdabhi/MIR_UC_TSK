const User = require("../models/user");
const env = require('dotenv');
const {sendmail} = require("./nodemailer")

env.config();

async function HandleGetAll(req, res) {
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

module.exports = { HandleGetAll, HandleAdd, HandleUpdateUser, HandleDeleteUser };
