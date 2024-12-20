const router = require("express").Router();
const controller = require("../../controllers/verifyOtpController");

router.post("/verifyOTP", controller.verifyOTP);
router.post("/resendOTP", controller.resendOTP);
//test
module.exports = router;
