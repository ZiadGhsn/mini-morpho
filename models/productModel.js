const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      // required: true,
      match:
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    },
    imageUrl: {
      type: String,
      required: true,
      match:
        /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/,
    },
    price: {
      type: Number,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    sizes: [String],
    width: [String],
    published: {
      type: Boolean,
      default: false,
    },
    variants: [
      {
        title: {
          type: String, // "BLACK/WHITE"
        }, //switch materials to array of materials id(table)
        //Add a reference to return the variants name with the material properties
        options: [String],
        price: {
          type: Number,
        },
        sku: {
          type: String,
        },
      },
    ],
    key: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true, collection: "Products" },
);

const productsModel = mongoose.model("Products", productSchema, "Products");
module.exports = productsModel;
