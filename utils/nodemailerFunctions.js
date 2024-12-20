const transporter = require("../config/nodemailerConfig");
const jwt = require("jsonwebtoken");
const sendResetEmail = (email, token, resetLink) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: `<a href="${resetLink}">Reset Password</a>`,
    },
    (err, info) => {
      if (err) {
        return res.status(500).json({
          Error: `Error ${err}`,
          success: false,
        });
      } else {
        return res.status(200).json({
          message: "Email Sent Successfully",
          success: true,
          data: info.response,
        });
      }
    },
  );
};
const verifyResetLink = (resetLink) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      resetLink,
      process.env.RESET_PASSWORD_KEY,
      (err, decodedData) => {
        if (err) {
          reject(new Error("Incorrect Token or expired"));
        } else {
          resolve(decodedData);
        }
      },
    );
  });
};
const saveResetLinkToUser = async (user, token) => {
  user.resetLink = token;
  await user.save();
};
module.exports = { sendResetEmail, verifyResetLink ,saveResetLinkToUser};
