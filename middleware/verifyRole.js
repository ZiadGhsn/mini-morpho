const jwt = require("jsonwebtoken");
const { getAllRoles } = require("../services/role-services")
const verifyRoles = (roles, req, res) => {
  try {
    return async (req, res, next) => {
      const cookie = req.headers["authorization"];
      const token = cookie.split(" ")[1];
      let result = jwt.decode(token);
      let roleToken = result.role;
      const roleObject = await getAllRoles()
      let roleTokenToLowerCase = roleObject[roleToken];
      if (!roles.includes(roleTokenToLowerCase)) {
        return res.sendStatus(401);
      }
      req.user = result.userId;
      req.email = result.email;
      next();
    };
  } catch (error) {
    return res.status(500).json({
      message: `Error ${error}`,
      success: false,
    });
  }
};

module.exports = verifyRoles;
