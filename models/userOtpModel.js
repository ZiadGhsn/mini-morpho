const mongoose = require("mongoose");
const userOtpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
  },
  createdAt: Date,
  expiresAt: Date,
});

const userOTPVerification = mongoose.model("userOtp", userOtpSchema);
module.exports = userOTPVerification;
