const nodemailer = require("nodemailer");
const env = require('dotenv');

env.config();
const transporter = nodemailer.createTransport({
    secure: true,
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: process.env.user,
        pass: process.env.nodemailer
    }
});

function sendmail(to){
    transporter.sendMail({
        to: to,
        subject: "you have sucessfully registered",
        html : "yoyo" 
    })
}
module.exports = { sendmail};