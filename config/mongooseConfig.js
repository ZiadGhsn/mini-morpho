const mongoose = require("mongoose");
const { DB_URL } = require("./envVariables");

module.exports = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(DB_URL);

    console.log("Connected To MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB!", error);
  }
};
