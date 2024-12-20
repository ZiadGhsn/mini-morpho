const router = require("express").Router();
const verifyJWT = require("../../middleware/verifyJWT");
const asyncErrorHandler = require("../../errors/asyncErrorHandler");

const assetRoutes = require("./assetLibraryRoutes");
router.use("/asset", verifyJWT, asyncErrorHandler(assetRoutes));

const userRoutes = require("./userRoutes");
router.use("/user",   verifyJWT, asyncErrorHandler(userRoutes));

const authRoutes = require("./authRoutes");
router.use("/auth", asyncErrorHandler(authRoutes));

const roleRoutes = require("./roleRoutes");
router.use("/role",  verifyJWT, asyncErrorHandler(roleRoutes));

const verifyOtpRoutes = require("./verifyOtpRoutes");
router.use("/otp", verifyJWT, asyncErrorHandler(verifyOtpRoutes));

const productRoutes = require("./productRoutes");
router.use("/product", verifyJWT, asyncErrorHandler(productRoutes));


module.exports = router;
