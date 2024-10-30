const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the Blog schema
const blogSchema = new Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'authorModel' // Dynamic reference path
  },
  authorModel: {
    type: String,
    required: true,
    enum: ['User', 'Company'] // Reference can be either User or Company
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tags: {
    type: [String] // Array of strings for tags
  },
  created_at: {
    type: Date,
    default: Date.now // Sets default to current date
  }
});

// Create the Blog model
const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
