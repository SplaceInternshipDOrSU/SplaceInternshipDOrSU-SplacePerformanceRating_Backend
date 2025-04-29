// Cloudinary
const cloudinary = require("cloudinary").v2;
const formidable = require("formidable");


const { response } = require("express");
const adminModel = require("../models/adminModel");
const userModel = require("../models/userModel");
const { responseReturn } = require("../utils/response");
const { createToken } = require("../utils/tokenCreate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




require("dotenv").config();


const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { error } = require("console");



class authControllers {
  resizeImage = async (imagePath) => {
    try {
      console.log("Resizing (without cropping):", imagePath);
  
      const outputDir = path.join(__dirname, "../../uploads");
      const outputFilePath = path.join(outputDir, "resized_" + path.basename(imagePath));
  
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
  
      const image = sharp(imagePath);
  
      const metadata = await image.metadata();
      console.log("Original size:", metadata.width, "x", metadata.height);
  
      if (metadata.width > 1000 || metadata.height > 1000) {
        await image
          .resize({
            width: 1000,
            height: 1000,
            fit: "inside", // This will resize without cropping
            withoutEnlargement: true // Prevent upsizing small images
          })
          .toFile(outputFilePath);
      } else {
        // If image is already smaller than 1000x1000, just copy it
        await image.toFile(outputFilePath);
      }
  
      return outputFilePath;
    } catch (error) {
      console.error("Error resizing image:", error);
      throw error;
    }
  };
  
  getField(field) {
    return Array.isArray(field) ? field[0] : field;
  }
  


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
        const user1 = await userModel.findById(id);
        // console.log("SELLER __________________________")
        // console.log(seller)
        responseReturn(res, 200, { userInfo: user1 });
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

// USER CONTROLLERS

  user_registration = async (req, res) => {
    console.log("USER REGISTRATION");
    try {
      const form = new formidable.IncomingForm({ multiples: true });
      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Form parsing error:", err);
          return responseReturn(res, 400, { error: "Form parsing error", requestMessage: "Application Request has failed. Please try again." });
        }
  
        let {
          firstName,
          middleName,
          lastName,
          birthDate,
          sex,
          email,
          role,
          category,
          phoneNumber,
          password,
        } = fields;

        console.log("fields")
        console.log(fields)

        firstName = this.getField(firstName);
        middleName = this.getField(middleName);
        lastName = this.getField(lastName);
        birthDate = this.getField(birthDate);
        sex = this.getField(sex);
        email = this.getField(email);
        role = this.getField(role);
        category = this.getField(category);
        phoneNumber = this.getField(phoneNumber);
        password = this.getField(password);

  
        const {
          profileImage,
        } = files;


        console.log(files)
        console.log("files")
  
        const getUser = await userModel.findOne({ email });
        if (getUser) {
          return responseReturn(res, 404, {
            error: "Email is already used. Please login instead.",
            requestMessage: "Email is already used. Please login instead.",
          });
        }
  
        cloudinary.config({
          cloud_name: process.env.cloud_name,
          api_key: process.env.api_key,
          api_secret: process.env.api_secret,
          secure: true,
        });
  
        try {
          // Updated helper function
          const resizeAndUploadImage = async (imageFile, folder) => {
            if (!imageFile) {
              throw new Error("No image file provided.");
            }
  
            // If it's an array (because of `multiples: true`), use the first one
            const actualFile = Array.isArray(imageFile) ? imageFile[0] : imageFile;
  
            console.log("Actual file:", actualFile.filepath);
  
            const resizedImage = await this.resizeImage(actualFile.filepath);
            const uploadResult = await cloudinary.uploader.upload(resizedImage, { folder });
  
            // Clean up local resized image
            fs.unlinkSync(resizedImage);
  
            return uploadResult;
          };
  
          const [
            profileImageURL,
          ] = await Promise.all([
            resizeAndUploadImage(profileImage, "usersCredentials"),
          ]);
  
          const hashedPassword = await bcrypt.hash(password, 10);
  
          const user = await userModel.create({
            name: firstName + " " + lastName,
            firstName,
            middleName,
            lastName,
            birthDate: new Date(birthDate),
            sex,
            phoneNumber,
            email,
            role,
            category,
            password: hashedPassword,
            profileImage: profileImageURL.url,
          });
  
          const token = await createToken({ id: user.id, role: user.role });
          res.cookie("accessToken", token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });


          console.log("done")
  
          responseReturn(res, 201, {
            message: "Request Recorded.",
            requestMessage: "Account Application Request Recorded.",
          });
        } catch (error) {
          console.error("Image upload or seller creation error:", error);
          return responseReturn(res, 500, { error: "Internal server error.", requestMessage: "Account Application Request has failed please try again." });
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      return responseReturn(res, 500, { error: "Internal server error.", requestMessage: "Account Application Request has failed please try again." });
    }
  };


  user_login = async (req, res) => {

    console.log("login")
    const { email, password } = req.body;
    try {
      const user = await userModel.findOne({ email }).select("+password");

      if (user) {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          const token = await createToken({
            id: user._id,
            role: user.role,
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
      console.log(error)
      responseReturn(res, 500, { error: error.message });
    }
  };
}



module.exports = new authControllers();
