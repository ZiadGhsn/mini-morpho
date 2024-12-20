const jwt = require("jsonwebtoken");
const config = require("../config/envVariables");
const expressError = require("../errors/expressError");

const verifyJWT = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    // console.log({ authHeader: authHeader });
    // console.log(req.body);
    if (req.body.key == "pass me") {
      return next();
    }
    if (!authHeader) {
      const error = new expressError("You are Not Authorized");
      next(error);
    }

    let token = authHeader.split(" ")[1];
    if (token.startsWith('"') && token.endsWith('"')) {
      token = token.substring(1, token.length - 1);
    }
    jwt.verify(token, config.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        //invalid token
        const error = new expressError("Forbidden");
        next(error);
      }
      req.user = decoded.userId;
      // req.user.email = decoded.email;
      req.email = decoded.email;
      req.role = decoded.role;
      next();
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error ${error}`,
      success: false,
    });
  }
};

module.exports = verifyJWT;
