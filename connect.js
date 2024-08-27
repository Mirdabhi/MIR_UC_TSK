const mongoose = require('mongoose');
const env = require('dotenv');
env.config();
const Url = process.env.CONNECTION_URL; 


async function connectMongoDb() {
  mongoose.connect(Url)
.then(() => {
    console.log('Connected to MongoDB Atlas');
})
.catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
}); 
}
 
module.exports = { connectMongoDb };