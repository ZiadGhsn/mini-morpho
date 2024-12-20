const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../config/envVariables");

let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: PASSWORD, 
  },
});
module.exports = transporter;
