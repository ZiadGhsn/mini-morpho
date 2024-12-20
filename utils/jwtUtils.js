const jwt = require("jsonwebtoken");
const generateToken = (user, secretKey, time, role) => {
  return jwt.sign(
    {
      userId: user?.id,
      email: user?.email,
      role: user?.role || role?.role || "",
    },
    secretKey,
    { expiresIn: time },
  );
};
//testing the pipeline again
const generateResetToken = (user) => {
  return jwt.sign(
    {
      userId: user?.id,
      email: user?.email,
    },
    process.env.RESET_PASSWORD_KEY,
    { expiresIn: "20m" },
  );
};

module.exports = { generateToken, generateResetToken };
