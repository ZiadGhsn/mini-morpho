const router = require("express").Router();
const controller = require("../../controllers/authController");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRole = require("../../middleware/verifyRole");
const { admin, designer } = require("../../constants");

router.post("/login", controller.login);
router.post("/signup", controller.signup);
router.post("/logout", controller.logout);
router.post("/forgot-password",verifyJWT ,controller.forgotPassword);
router.post("/reset-password",verifyJWT, controller.resetPassword);
router.post("/change-password",verifyJWT, controller.changePassword);

module.exports = router;
