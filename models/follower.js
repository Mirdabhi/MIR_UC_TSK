const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the FollowerFollowing schema
const followerFollowingSchema = new Schema({
  follower_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User schema for the follower
    required: true
  },
  following_id: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'following_model', // Dynamically reference either User or Company
    required: true
  },
  following_model: {
    type: String,
    required: true,
    enum: ['User', 'Company'] // Specifies the referenced collection: 'User' or 'Company'
  },
  follow_date: {
    type: Date,
    default: Date.now // Sets the default date to the time of follow creation
  }
});

const FollowerFollowing = mongoose.model('FollowerFollowing', followerFollowingSchema);

module.exports = FollowerFollowing;
