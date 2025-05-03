const roleModel = require("../../models/roleModel");
const categoryModel = require("../../models/categoryModel");
// const additionalFeatureModel = require("../../models/additionalFeatureModel");
const { responseReturn } = require("../../utils/response");
const cloudinary = require("cloudinary").v2;
exports.cloudinary = cloudinary;
const formidable = require("formidable");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

class categoryController {
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
      .resize(800, 800) // Adjust the width and height as needed
      .toFile(outputFilePath);
    return outputFilePath;
  };

// ROLES CONTROLLERS
   
  roles_get = async (req, res) => {
    console.log("roles_get");
    
    const { page, searchValue, parPage } = req.query;
    console.log("req.query", req.query);
  
    try {
      // Parse and sanitize pagination parameters
      const pageNum = Math.max(1, parseInt(page));     // Ensure page is at least 1
      const perPage = parseInt(parPage);              // Default to 10 per page
      const skip = perPage * (pageNum - 1);                 // Calculate skip for pagination
  
      // Build search query
      let rolesQuery = {};
      if (searchValue) {
        rolesQuery = {
          name: { $regex: searchValue, $options: "i" },      // Case-insensitive partial match
        };
      }
  
      // Fetch roles based on query, pagination, and sort by latest created
      const roles = await roleModel
        .find(rolesQuery)
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: 1 });
  
      // Count total number of matching roles
      const totalRoles = await roleModel.countDocuments(rolesQuery);
      const totalPages = Math.ceil(totalRoles / perPage);   // Calculate total pages
  
      console.log("Roles fetched successfully");
  
      // Send back the roles and pagination info
      return responseReturn(res, 200, {
        totalRoles,
        totalPages,
        currentPage: pageNum,
        perPage,
        roles,
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal server error" });
    }
  };
  role_add = async (req, res) => {
    const form = new formidable.IncomingForm({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 404, { error: "Form parsing error" });
      } else {
        console.log("Form parsed successfully");
        let { name, description } = fields;
  
        // Access the first element of the array if it's an array
        name = Array.isArray(name) ? name[0] : name;
        description = Array.isArray(description) ? description[0] : description;
  
        console.log(fields);
  
        if (!name || !description) {
          return responseReturn(res, 400, {
            error: "Name or Description not provided",
          });
        }
  
        name = name.trim();
        const slug = name.split(" ").join("-");
  
        // Check if the category already exists
        const existingRole = await roleModel.findOne({ name });
        if (existingRole) {
          return responseReturn(res, 409, { error: "Role already exists" });
        }
  
        try {
          const role = await roleModel.create({
            name,
            description,
            slug,
          });

          console.log("DONE")
          console.log(role)
          return responseReturn(res, 201, {
            role,
            message: "Role added successfully",
          });
        } catch (error) {
          console.error("Error Here", error);
          return responseReturn(res, 500, { error: "Internal server error" });
        }
      }
    });
  };
  delete_role = async (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return responseReturn(res, 400, { error: "Role ID must be provided" });
    }
  
    try {
      // Find the role by ID
      const role = await roleModel.findById(id);
      if (!role) {
        return responseReturn(res, 404, { error: "Role not found" });
      }
  
      // Delete the role
      await roleModel.deleteOne({ _id: id });
  
      // Fetch remaining roles
      const remainingRoles = await roleModel.find();
  
      return responseReturn(res, 200, {
        message: "Role deleted successfully",
        roles: remainingRoles,
      });
    } catch (error) {
      console.error("Error deleting role:", error);
      return responseReturn(res, 500, { error: "Internal server error" });
    }
  };

  get_role_by_id = async (req, res) => {
    console.log("ROLE GET BY ID")
    const { id } = req.params;
  
    try {
      const role = await roleModel.findById(id);
      
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
  
      console.log("role")
      console.log(role)
      responseReturn(res, 200, { role });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Server error" });
    }
  };

  edit_role = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields) => {
        if (err) {
            return responseReturn(res, 400, { error: "Form parsing error" });
        }

        let id = fields.id?.[0];
        let name = fields.name?.[0];
        let description = fields.description?.[0];

        console.log(fields);
        console.log({ id, name, description });
        console.log("fields ----------------");

        if (!id) {
            return responseReturn(res, 400, { error: "ID is required" });
        }

        try {
            const role = await roleModel.findById(id);
            if (!role) {
                return responseReturn(res, 404, { error: "Role not found" });
            }

            // Check for duplicate name if name is provided
            if (name) {
                name = name.trim();

                // Check if another role with the same name exists (excluding the current role)
                const existingRole = await roleModel.findOne({
                    name: name,
                    _id: { $ne: id } // Exclude current role by ID
                });

                if (existingRole) {
                    return responseReturn(res, 400, { error: "Role name already exists" });
                }

                role.name = name;
                role.slug = name.split(" ").join("-").toLowerCase();
            }

            if (description) {
                role.description = description.trim();
            }

            await role.save();

            return responseReturn(res, 200, { role, message: "Role updated successfully" });
        } catch (error) {
            console.error(error.message);
            return responseReturn(res, 500, { error: "Internal server error" });
        }
    });
};


  

// CATEGORIES CONTROLLERS
categories_get = async (req, res) => {
  console.log("categories_get");
  
  const { page, searchValue, parPage } = req.query;
  console.log("req.query", req.query);

  try {
    // Parse and sanitize pagination parameters
    const pageNum = Math.max(1, parseInt(page));     // Ensure page is at least 1
    const perPage = parseInt(parPage);              // Default to 10 per page
    const skip = perPage * (pageNum - 1);                 // Calculate skip for pagination

    // Build search query
    let rolesQuery = {};
    if (searchValue) {
      rolesQuery = {
        name: { $regex: searchValue, $options: "i" },      // Case-insensitive partial match
      };
    }

    // Fetch roles based on query, pagination, and sort by latest created
    const categories = await categoryModel
      .find(rolesQuery)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: 1 });

    // Count total number of matching roles
    const totalCategories = await categoryModel.countDocuments(rolesQuery);
    const totalPages = Math.ceil(totalCategories / perPage);   // Calculate total pages

    console.log("Categories fetched successfully");

    // Send back the roles and pagination info
    return responseReturn(res, 200, { 
      totalCategories,
      totalPages,
      currentPage: pageNum,
      perPage,
      categories,
    });
  } catch (error) {
    console.log(error.message);
    return responseReturn(res, 500, { error: "Internal server error" });
  }
};
  
category_add = async (req, res) => {
  const form = new formidable.IncomingForm({ multiples: true });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return responseReturn(res, 404, { error: "Form parsing error" });
    } else {
      console.log("Form parsed successfully");
      let { name, description } = fields;

      // Access the first element of the array if it's an array
      name = Array.isArray(name) ? name[0] : name;
      description = Array.isArray(description) ? description[0] : description;

      console.log(fields);

      if (!name || !description) {
        return responseReturn(res, 400, {
          error: "Name or Description not provided",
        });
      }

      name = name.trim();
      const slug = name.split(" ").join("-");

      // Check if the category already exists
      const existingCategory = await categoryModel.findOne({ name });
      if (existingCategory) {
        return responseReturn(res, 409, { error: "Category already exists" });
      }

      try {
        const category = await categoryModel.create({
          name,
          description,
          slug,
        });

        console.log("DONE")
        console.log(category)
        return responseReturn(res, 201, {
          category,
          message: "Category added successfully",
        });
      } catch (error) {
        console.error("Error Here", error);
        return responseReturn(res, 500, { error: "Internal server error" });
      }
    }
  });
};






  
}

module.exports = new categoryController();
