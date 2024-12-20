const router = require("express").Router();
const apiRouter = require("./api");

router.use("/mini", apiRouter);

module.exports = router;
