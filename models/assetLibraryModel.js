const mongoose = require("mongoose");

const assetLibrarySchema = new mongoose.Schema(
  {
    serial_number: {
      type: String,
      required: true,
    },
  User: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  product:[
    {
    type: mongoose.Types.ObjectId,
    ref: "Products",
  }
]
},
  { timestamps: true, collection: "assetlibraries" }
);

const assetLibraryModel = mongoose.model("assetLibrary", assetLibrarySchema);
module.exports = assetLibraryModel;
