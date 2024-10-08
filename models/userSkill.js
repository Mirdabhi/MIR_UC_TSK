const mongoose = require('mongoose');
const { Schema } = mongoose; // Import Schema from mongoose

const skillSchema = new Schema({
    parent_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    name: { 
        type: String, 
        required: true 
    }
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;

