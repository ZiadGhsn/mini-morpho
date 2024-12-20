const express = require("express");
const { PORT, VIEWER_PORT, CORS_ORIGIN, FRONT } = require("./envVariables");
const cookieParser = require("cookie-parser");
const router = require("../routes/router");
const cors = require("cors");
// const ExpressError = require("./ExpressError");
//Adding helmet for an additional layer of security
const helmet = require("helmet");
// DDOS attack configuration
const rateLimit = require("express-rate-limit");
// Limiting API calls to 100 calls max each 10 minutes
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
});
const errorController = require("../errors/errorController");
module.exports = async (app) => {
  //Midleware Section
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Methods",
      "POST, PUT, PATCH, GET, DELETE, OPTIONS",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Api-Key, X-Requested-With, Content-Type, cookies, Accept, Authorization",
    );
    next();
  });
  app.use(express.json({ extended: true }));
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: [
        CORS_ORIGIN,
        `http://localhost:${PORT}`,
        `http://localhost:${VIEWER_PORT}`,
        `http://localhost:${FRONT}`,
      ],
      credentials: true,
      allowedHeaders: [
        "Origin",
        "X-Api-Key",
        "X-Requested-With",
        "Content-Type",
        "cookies",
        "Accept",
        "Authorization",
      ],
      exposedHeaders: ["cookies"],
    }),
  );
  app.use(express.json({ extended: true }));
  app.use(express.urlencoded({ extended: false }));
  app.use(errorController);

  app.use(limiter);
  app.use(helmet());
  app.use(helmet.frameguard());
  app.use(cookieParser());
  app.use(router);
};
