const userSchema = require("../models/userModel");
const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById } = require('../services/mongooseCrud'); // Adjust the path as needed
const expressError = require("../errors/expressError");
const hashPassword = require("../utils/passwordUtils");
const jwtUtils = require("../utils/jwtUtils");
const roleSchema = require("../models/roleModel");
const bcrypt = require("bcrypt");
const config = require("../config/envVariables");
const nodemailerController = require("./verifyOtpController");
const nodemailerFunctions = require("../utils/nodemailerFunctions");
const generateToken = jwtUtils.generateToken;
const generateResetToken = jwtUtils.generateResetToken;
const sendResetEmail = nodemailerFunctions.sendResetEmail;
const verifyResetLink = nodemailerFunctions.verifyResetLink;
const saveResetLinkToUser = nodemailerFunctions.saveResetLinkToUser;
const resHandle = require("../utils/responseHandle");
const { REFRESH_TOKEN_SECRET,ACCESS_TOKEN_SECRET } = require("../config/envVariables");

exports.signup =  async (req, res, next) => {
  const { password, role } = req.body;
  const hashedPassword = await hashPassword(password);
  const roleToBeFetched = await getModelById(
      roleSchema,
      role,
  );
  console.log(roleToBeFetched);
  if (roleToBeFetched.role == "Developer" || roleToBeFetched.role == "Admin")
    return res.status(403).json("Forbidden");

  const newUser = await userSchema
    .create({
      ...req.body,
      verified: false,
      password: hashedPassword,
      role: role,
    })
    .then((result) => {
      nodemailerController.sendOTPVerification(result, res);
    });
  //then send email
};

exports.login =  async (req, res, next) => {
    const { email, password } = req.body;
    const query = { email };
    const userLogin = await findOne(
        userSchema,
        query,
    );
    if (!userLogin) {
      const error = new expressError("User Not Found", 404);
      next(error);
    }
    let roleObject;
    if (userLogin && userLogin.role) {
      roleObject = await getModelById(
        roleSchema,
        userLogin.role,
    );
    }
    if (userLogin && userLogin.isDeleted) {
      const error = new expressError("This Account is Forbidden", 401);
      next(error);
    }
    if (!userLogin.verified) {
      const error = new expressError("Your Account is not Verified", 403);
      next(error);
    }
    if (await bcrypt.compare(password, userLogin.password)) {
      console.log({ roleObject: roleObject });
      const accessToken = generateToken(
        userLogin,
        config.ACCESS_TOKEN_SECRET,
        "30d",
        roleObject,
      );
      const refreshToken = generateToken(
        userLogin,
        config.REFRESH_TOKEN_SECRET,
        "40d",
        roleObject,
      );
      userLogin.refreshToken = refreshToken;
      await userLogin.save();
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: false, //activate it in production mode
        maxAge: 3888000000,
      });
      return res.json(accessToken);
    }
  };
exports.logout = async (req, res, next) => {
    // Check for the cookies in the request headers
    const cookie = req.headers.cookie; // Corrected to 'cookie'
    
    if (!cookie) {
      const error = new expressError("JWT Token Not Found", 400);
      return next(error); // Return here to stop further execution
    }
    // Extract the refresh token from the cookie
    const refreshToken = cookie.split("=")[1]; // Corrected from 'cookies' to 'cookie'
      const foundUser = await findOne(userSchema, { refreshToken });
    if (foundUser) {
      foundUser.refreshToken = "";
      await foundUser.save();
        res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
      });
      return res.json("User Logout Successfully");
    } else {
      return res.status(400).json("Invalid refresh token"); 
    }
  };
  
  exports.forgotPassword = async (req, res, next) => {
      const { email } = req.body;
      const userToBeFetched = await findOne(userSchema, { email });
  
      if (!userToBeFetched) {
        const error = new expressError("User Not Found", 404);
        return next(error); // Ensure you `return` after calling `next` to avoid further execution.
      }
  
      const token = generateResetToken(userToBeFetched);
      const resetLink = `${config.CLIENT_URL}/resetpassword/${token}`;
      await saveResetLinkToUser(userToBeFetched, token);
  
      sendResetEmail(email, resetLink, (err, info) => {
        if (err) {
          return res.status(500).json({
            error: `Error sending email: ${err.message}`,
            success: false,
          });
        }
        return res.status(200).json({
          message: "Email Sent Successfully",
          success: true,
          data: info.response,
        });
      });

  };
  

exports.resetPassword = async (req, res, next) => {
    const { resetLink, newPass } = req.body;
    if (!resetLink) {
      const error = new expressError("Missing resetLink", 400);
      next(error);
    }
    const decodedData = verifyResetLink(resetLink);
    const hashedPassword = await hashPassword(newPass);
    const userToUpdate = await findOne(
        userSchema,
        { resetLink },
    );
    if (!userToUpdate) {
      const error = new expressError("User Not Found", 404);
      next(error);
    }
    userToUpdate.password = hashedPassword;
    userToUpdate.resetLink = "";
    await userToUpdate.save();
    return res.json("Password Changed Successfully");
  };
  exports.changePassword = async (req, res, next) => {
      const userId = req.user;
  
      // Ensure we fetch the Mongoose document, not a plain object
      const userToBeFetched = await userSchema.findById(userId);
  
      if (!userToBeFetched) {
        return resHandle.handleError(res, 404, "User Not Found", false);
      }
  
      const { currentPassword, newPassword } = req.body;
  
      // Compare the current password
      const isMatch = await bcrypt.compare(currentPassword, userToBeFetched.password);
      if (!isMatch) {
        return resHandle.handleError(res, 401, "Current Password is incorrect", false);
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  
      // Update the user's password
      userToBeFetched.password = hashedNewPassword;
      await userToBeFetched.save();
  
      return resHandle.handleData(res, 200, "Password Changed Successfully", true);

  };
  