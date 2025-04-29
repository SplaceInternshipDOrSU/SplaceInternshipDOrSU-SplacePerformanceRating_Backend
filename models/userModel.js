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
    role: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
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

// Middleware to handle listings availability when seller status changes
// sellerSchema.pre("save", async function (next) {
//   // Check if the status has been modified
//   if (this.isModified("status")) {
//     const newStatus = this.status;

//     // If the seller's status is not active, update their listings
//     if (newStatus !== "active") {
//       await Listing.updateMany(
//         { sellerId: this._id }, // Find listings by this seller
//         { isAvailable: false }  // Set isAvailable to false
//       );
//     } else {
//       // Optionally, re-activate listings if the seller is re-activated
//       await Listing.updateMany(
//         { sellerId: this._id },
//         { isAvailable: true }
//       );
//     }
//   }

//   next();
// });

userSchema.index(
  {
    firstName: "text",
    middleName: "text",
    lastName: "text",
    email: "text",
    associationName: "text",
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
const Seller = mongoose.model('User', userSchema);

module.exports = Seller;
