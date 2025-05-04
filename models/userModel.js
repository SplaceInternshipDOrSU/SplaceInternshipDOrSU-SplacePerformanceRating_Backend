const { Schema, model } = require("mongoose");
// const Listing = require("../models/listingModel"); // Import your Listing model
const mongoose = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    sex: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    profileImage: {
      type: String,
    },
    roleName: {
      type: String,
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    role: { type: Schema.Types.ObjectId, ref: 'roles', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
    password: {
      type: String, 
      required: true,
      select: false,
    },
   
    status: {
      type: String,
      default: "pending", // Possible values: "active", "inactive", "pending"
    },
    rating: {
      type: Number,
      default: 0,
    },
 
   
  },
  { timestamps: true }
);


userSchema.index(
  {
    firstName: "text",
    middleName: "text",
    lastName: "text",
    email: "text",
    name: "text",
  },
  {
    weights: {
      name: 7,
      firstName: 6,
      lastName: 5,
      email: 4,
      middleName: 3,
    
    },
  }
);


// module.exports = model("sellers", sellerSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
