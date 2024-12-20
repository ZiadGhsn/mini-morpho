const mongoose = require("mongoose");

const assetLibrarySchema = new mongoose.Schema(
  {
    serial_number: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "assetlibraries" }
);

const assetLibraryModel = mongoose.model("assetLibrary", assetLibrarySchema);
module.exports = assetLibraryModel;
