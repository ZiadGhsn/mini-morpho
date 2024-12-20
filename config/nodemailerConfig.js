const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../config/envVariables");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
});


module.exports = transporter;
