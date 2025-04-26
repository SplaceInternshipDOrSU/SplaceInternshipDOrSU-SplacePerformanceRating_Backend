// Cloudinary
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");


const { response } = require("express");
const adminModel = require("../models/adminModel");
// const sellerModel = require("../models/sellerModel");
const { responseReturn } = require("../utils/response");
const { createToken } = require("../utils/tokenCreate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




require("dotenv").config();


const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { error } = require("console");
// const traderModel = require("../models/traderModel");


class authControllers {
  resizeImage = async (imagePath) => {
    const outputDir = path.join(__dirname, "../../uploads");
    const outputFilePath = path.join(
      outputDir,
      "resized_" + path.basename(imagePath)
    );

    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    await sharp(imagePath)
      .resize(1000, 1000) // Adjust the width and height as needed
      .toFile(outputFilePath);
    return outputFilePath;
  };


  admin_login = async (req, res) => {
    const { email, password } = req.body;
    console.log("admin_login")
    console.log(req.body)
    try {
      const admin = await adminModel.findOne({ email }).select("+password");
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          const token = await createToken({
            id: admin._id,
            role: admin.role,
          });

          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, {
            error: "Invalid Credentials, Please try Again",
          });
        }
      } else {
        responseReturn(res, 404, {
          error: "Invalid Credentials, Please try Again",
        });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
  
  add_new_admin = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("add_new_admin");
    console.log(req.body);
  
    try {
      // Check if admin with the same email already exists
      const existingAdmin = await adminModel.findOne({ email });
      if (existingAdmin) {
        return responseReturn(res, 400, {
          error: "Admin with this email already exists",
        });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save new admin
      const newAdmin = new adminModel({
        name,
        email,
        password: hashedPassword,
        role: "admin", // Default already set, but keeping it explicit is fine
      });
  
      await newAdmin.save();
  
      responseReturn(res, 201, {
        message: "Admin account created successfully",
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };


  change_password = async (req, res) => {
    console.log("CHANGE")
    console.log(req.body)
    const { currentPassword, newPassword, id } = req.body;
    // const { id } = req.admin; // Assuming you decode the JWT and get the admin's ID
  
    try {
      // Fetch the admin from the database
      const admin = await adminModel.findById(id).select('+password');
      if (!admin) {
        return res.status(404).json({
          error: "Admin not found",
        });
      }
  
      // Compare the current password with the stored password
      const match = await bcrypt.compare(currentPassword, admin.password);
      if (!match) {
        return res.status(400).json({
          error: "Current password is incorrect",
        });
      }
  
      // Hash the new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the password in the database
      admin.password = hashedNewPassword;
      await admin.save();
  
      // Return success response
      res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "An error occurred while changing the password",
      });
    }
  };
  

 




  
  

  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === "admin") {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
        console.log(user);
      } else {
        const seller = await sellerModel.findById(id);
        // console.log("SELLER __________________________")
        // console.log(seller)
        responseReturn(res, 200, { userInfo: seller });
        // console.log(seller);
      }
    } catch (error) {
      responseReturn(res, 500, {
        error: "Internal Server Error",
      });
    }
  };


  

 
 



  logout = async (req, res) => {
    console.log("asdadasd")
    try {
      res.cookie('accessToken', null,{
        expires : new Date(Date.now()),
        httpOnly: true
      })

      console.log("success -----------")
      responseReturn(res,200,{
        message: "Logged out Successfully"
      })
    } catch (error) {
      console.log(error)
      responseReturn(res, 500, {
        error: error.message,
      });
      
    }
  }

 



}



module.exports = new authControllers();
