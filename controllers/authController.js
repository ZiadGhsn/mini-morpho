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

exports.handleRefreshToken = async (req, res, next) => {
    const cookies = req.headers.cookies;
    if (!cookies) {
      const error = new expressError("Username and Password are Required", 404);
      next(error);
    }
    const refreshToken = cookies.split("=")[1];
    const query = { refreshToken: refreshToken };
    const foundUser = await getModelByQuery(
        userSchema,
        query,
    );
    if (!foundUser) {
      const error = new expressError("Forbidden", 400);
      next(error);
    }
    jwt.verify(refreshToken, config.REFRESH_TOKEN_SECRET, (err, decoded) => {
      if (err || foundUser._id.toString() !== decoded.userId) {
        const error = new expressError("Forbidden", 403);
        next(error);
      }
      const accessToken = generateToken(decoded, config.ACCESS_TOKEN_SECRET, {
        expiresIn: "30d",
      });
      res.json({ accessToken });
    });
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
    const userToBeFetched = await findOne(
        userSchema,
        { email: email },
    ); 
    if (!userToBeFetched) {
      const error = new expressError("User Not Found", 404);
      next(error);
    }
    const token = generateResetToken(userToBeFetched);
    const data = `${config.CLIENT_URL}/resetpassword/${token}`;
    await saveResetLinkToUser(userToBeFetched, token);
    sendResetEmail(userToBeFetched.email, token, data);
    return res.json("Email Sent Successfully");
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
      const userToBeFetched = await getModelById(
        userSchema,
        userId);
      if (!userToBeFetched)
        return resHandle.handleError(res, 404, "User Not Found", false);
      const { currentPassword, newPassword } = req.body;
      bcrypt.compare(
        currentPassword,
        userToBeFetched.password,
      async (err, result) => {
        if (err) {
          const error = new expressError("Password Comparison Error", 500);
          next(error);
        }
        if (!result) {
          const error = new expressError("Current Password is Incorrect", 401);
          next(error);
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        userToBeFetched.password = hashedNewPassword;
        await userToBeFetched.save();
        return res.json("Password Changed Successfully");
      },
    );
  };
exports.signUpDeveloper = async (req, res) => {
  try {
    bcrypt.hash(req.body.password, 12, async (err, hash) => {
      if (err) return resHandle.handleError(res, 500, `Error ${err}`, false);
      else {
        try {
          const newUser = await user
            .create({
              ...req.body,
              verified: false,
              password: hash,
            })
            .then((result) => {
              nodemailerController.sendOTPVerification(result, res);
            });
        } catch (error) {
          resHandle.handleError(res, 500, `Error ${error}`, false);
        }
      }
    });
  } catch (error) {
    resHandle.handleError(res, 500, `Error ${error}`, false);
  }
};