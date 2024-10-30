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
const Application = require('../models/applcation');
const FollowerFollowing = require('../models/follower'); // Import FollowerFollowing model
const Company = require('../models/company'); // Import Company model
const Blog = require('../models/blog');

env.config();
const Salt = process.env.Salt; 
const JWT_SECRET = process.env.jwt;



async function deleteBlog(req, res) {
    try {
        const { blog_id } = req.body; // Get blog_id from route parameters
        const author_id = req.user._id; // Assuming the token middleware adds user info to req.user

        // Find the blog by ID and author_id and delete it
        const blog = await Blog.findOneAndDelete({ _id: blog_id, author_id });

        // If no blog is found, return a 404
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found or unauthorized to delete.' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Blog deleted successfully.' });
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


async function createBlog(req, res) {
    try {
        const { title, content, tags, authorModel } = req.body; // Get data from request body
        const author_id = req.user._id; // Assuming the token middleware adds user info to req.user

        // Validate that the authorModel is either "User" or "Company"
        if (!['User', 'Company'].includes(authorModel)) {
            return res.status(400).json({ message: 'Invalid author model. Must be either User or Company.' });
        }

        // Create a new blog instance
        const newBlog = new Blog({
            author_id,
            authorModel,
            title,
            content,
            tags
        });

        // Save the new blog post to the database
        const savedBlog = await newBlog.save();

        // Send a response with the created blog post
        res.status(201).json({
            message: 'Blog created successfully',
            blog: savedBlog
        });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


async function getAllBlogsByAuthor(req, res) {
    try {
        const author_id = req.user._id; // Assuming the token middleware adds user info to req.user

        // Find all blogs by the author
        const blogs = await Blog.find({ author_id });

        // If no blogs are found, respond with a message
        if (blogs.length === 0) {
            return res.status(404).json({ message: 'No blogs found for this author.' });
        }

        // Return the blogs if found
        res.status(200).json({
            message: 'Blogs fetched successfully.',
            blogs
        });
    } catch (error) {
        console.error('Error fetching blogs:', error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = {getAllBlogsByAuthor , createBlog , deleteBlog };
  