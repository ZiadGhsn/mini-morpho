const express = require("express");
const { PORT } = require("./envVariables");
const databaseConnection = require("./mongooseConfig");
const expressApp = require("./expressConfig");

module.exports = async () => {
  const app = express();
  await databaseConnection();
  await expressApp(app);
  app
    .listen(PORT, () => {
      console.log(`Server Listening on ${PORT}`);
    })
    .on("error", (error) => {
      console.log(`Error While Starting Application: ${error}`);
    });
};
