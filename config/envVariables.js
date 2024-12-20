const dotenv = require("dotenv");
dotenv.config();

var config = {
  DB_URL: process.env.MONGOCONNECTION,
  PORT: process.env.PORT,
  VIEWER_PORT: process.env.VIEWER_PORT,
  SECRECT_API_KEY_GENERATOR: process.env.SECRECT_API_KEY_GENERATOR,
  RESET_PASSWORD_KEY: process.env.RESET_PASSWORD_KEY,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ROLE_DESIGNER: process.env.ROLE_DESIGNER,
  ROLE_DEVELOPER: process.env.ROLE_DEVELOPER,
  ROLE_ADMIN: process.env.ROLE_ADMIN,
  ROLE_CLIENT: process.env.ROLE_CLIENT,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SERVER: process.env.CLIENT_SERVER,
  CLIENT_URL: process.env.CLIENT_URL,
  URL: process.env.URL,
  SCENE_VIEWER: process.env.SCENE_VIEWER,
  EMAIL: process.env.EMAIL,
  PASSWORD: process.env.PASSWORD,
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
  AWS_REGION: process.env.AWS_REGION,
};

module.exports = config;
