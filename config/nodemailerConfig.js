const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../config/envVariables");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL, // replace with your email
    pass: PASSWORD, // replace with your password
  },
});
module.exports = transporter;
