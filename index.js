// exporting modules.
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user');
const {connectMongoDb} = require('./connect');
const env = require('dotenv');


//using middlewares.
const app = express();
app.use(morgan('tiny'));
app.use(express.json());

// connecting env
env.config();
const Url = process.env.CONNECTION_URL; 

// connecting database.
connectMongoDb();

//creating routes
app.use("/API" , userRouter);



//launching the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
