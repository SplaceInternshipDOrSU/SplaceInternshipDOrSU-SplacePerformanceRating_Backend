const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true, // Ensure email uniqueness
  },

  password: {
    type: String,
    required: true,
    select: false, // Do not return password by default
  },

  role: {
    name: {
      type: String,
      default: "admin",
    },
    description: {
      type: String,
      default: "Administrator with full access",
    },
  },

  category: {
    name: {
      type: String,
      default: "admin",
    },
    description: {
      type: String,
      default: "Admin category",
    },
  },

  status: {
    type: String,
    enum: ["active", "inactive", "pending"],
    default: "pending",
  },
});

module.exports = model("admins", adminSchema);
