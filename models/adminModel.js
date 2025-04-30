const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },

  role: {
    type: String,
    default: "admin",
  },
  category: {
    type: String,
    default: "admin",
  },
  status: {
    type: String,
    default: "pending", // Possible values: "active", "inactive", "pending"
  },
});

module.exports = model("admins", adminSchema);
