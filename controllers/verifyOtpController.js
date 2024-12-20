const userOtpSchema = require("../models/userOtpModel");
const userSchema = require("../models/userModel");
const transporter = require("../config/nodemailerConfig");
const bcrypt = require("bcrypt");
const config = require("../config/envVariables");
const jwt = require("jsonwebtoken");
const { getAllModels, getModelById, findOne,createModel, deleteModelById, updateModelById } = require('../services/mongooseCrud'); // Adjust the path as needed
//test again

exports.sendOTPVerification = async ({ _id, email }, res) => {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: config.EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p> Enter ${otp} in the app to verify your account </p>`,
    };
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);
    const newOTPVerification = await new userOtpSchema({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });
    await newOTPVerification.save();
    await transporter.sendMail(mailOptions);
    res.json({
      status: "Pending",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  };
exports.verifyOTP = async (req, res) => {
    let { userId, otp } = req.body;
    if (!userId || !otp) return res.status(404).json("User or OTP Not Found");
    else {
      const userOTPVerificationRecords = await getModelById(
        userOtpSchema,
        { userId },
      );
      if (userOTPVerificationRecords.length <= 0)
        return res
          .status(404)
          .json("Account record doesn't exist or has been verified already");
      else {
        const { expiresAt } = userOTPVerificationRecords[0];
        const hashedOTP = userOTPVerificationRecords[0].otp;
        if (expiresAt < Date.now()) {
          //user otp has expired
          await userOtpSchema.deleteMany({ userId });
          return res.status(404).json("OTP has Expired");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          if (!validOTP) return res.json("Otp  entered is wrong");
          //   return resHandle.handleError(
          //     res,
          //     404,
          //     `The OTP entered is wrong`,
          //     false,
          //   );
          else {
            await userSchema.updateOne({ _id: userId }, { verified: true });
            await userOtpSchema.deleteMany({ userId });
            const userLogIn = await userSchema.findOne({ _id: userId });
            //Create an access Token
            const accessToken = jwt.sign(
              {
                userId: userLogIn._id,
                // role: roleObject.role,
                role: "",
                email: userLogIn.email,
              },
              config.ACCESS_TOKEN_SECRET,
              { expiresIn: "12h" },
            );

            // //Create a refresh Token
            const refreshToken = jwt.sign(
              {
                userId: userLogIn._id,
                // role: roleObject.role,
                role: "",
                email: userLogIn.email,
              },
              config.REFRESH_TOKEN_SECRET,
              { expiresIn: "40d" },
            );
            // Update user's refresh token
            userLogIn.refreshToken = refreshToken;
            const result = await userLogIn.save();
            // Set cookie with refresh token
            res.cookie("jwt", refreshToken, {
              httpOnly: true,
              sameSite: "None",
              // secure: true, //activate it in production mode
              maxAge: 3888000000,
            });
            // Return success response with access token and user data
            res.status(200).json(accessToken);
          }
        }
      }
    }
  };

  exports.resendOTP = async (req, res, next) => {
    const { userId, email } = req.body;
      if (!userId || !email) {
      return resHandle.handleError(res, 404, `User Not Found`, false);
    }
      await deleteModelById(userOtpSchema, userId); // Pass the userId directly
      try {
      const otpSent = await this.sendOTPVerification({ _id: userId, email }, res);
      if (!otpSent) {
        return resHandle.handleError(res, 500, "Failed to send OTP", false);
      }
      
      return res.json("OTP Verification Sent Successfully");
    } catch (error) {
      return resHandle.handleError(res, 500, "Error sending OTP", false);
    }
  };
  