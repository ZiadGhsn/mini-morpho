const router = require("express").Router();
const controller = require("../../controllers/userController");
const verifyJWT = require("../../middleware/verifyJWT");
const verifyRoles = require("../../middleware/verifyRole");
const { designer, admin, client } = require("../../constants");

router.get("/get-all", controller.getAllUsers);
router.get("/get-by-id/:id", controller.getUserById);
router.put("/update-by-id/:id", controller.updateUserById);
router.delete(
  "/delete-By-Id/:id",
  verifyJWT,
  verifyRoles([admin]),
  controller.deleteUserById,
);


module.exports = router;
