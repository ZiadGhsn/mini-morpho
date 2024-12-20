const mongoose = require("mongoose");
const roleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    lead: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isMCX: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

const roleModel = mongoose.model("Role", roleSchema);
module.exports = roleModel;
