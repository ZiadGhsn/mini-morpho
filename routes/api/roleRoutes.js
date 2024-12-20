const router = require("express").Router();
const controller = require("../../controllers/roleController");
const verifyRole = require("../../middleware/verifyRole");
const verifyJWT = require("../../middleware/verifyJWT");
const { designer, admin, client } = require("../../constants");
const { validateRoleSchema } = require("../../validation/middleware");
router.get(
  "/get-all",
  verifyJWT,
  verifyRole([admin]),
  controller.getAllRoles,
);
router.get("/get-by-id/:id",verifyJWT,controller.getRoleById);
router.route("/create")
  .post(validateRoleSchema, verifyRole([admin]), controller.createRole);
router.delete(
  "/delete-by-id/:id",
  verifyJWT,
  verifyRole([admin]),
  controller.deleteRole,
);
router.put(
  "/update-by-id/:id",
  verifyJWT,
  verifyRole([admin]),
  controller.updateRoleById,
);
module.exports = router;
