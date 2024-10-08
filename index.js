// exporting modules.
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user');
const companyRoute = require('./routes/company');
const {connectMongoDb} = require('./config/connect');
const env = require('dotenv');
const path = require('path');
const recruiterRoutes = require('./routes/rec'); // Adjust the path as needed




//using middlewares.
const app = express();
app.use(morgan('tiny'));
app.use(express.json());

// Serve static files (optional, in case you need it for other purposes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// connecting env
env.config();
const Url = process.env.CONNECTION_URL; 

// connecting database.
connectMongoDb();

//creating routes
app.use("/User" , userRouter);
app.use("/Company", companyRoute);
app.use('/recruiter', recruiterRoutes);



//launching the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
