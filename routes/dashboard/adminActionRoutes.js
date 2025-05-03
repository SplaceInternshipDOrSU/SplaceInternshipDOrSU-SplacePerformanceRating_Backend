const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const adminController = require("../../controllers/dashboard/AdminController");

// ROLES ROUTE
router.get("/roles-get", adminController.roles_get);
router.post("/role-add", adminController.role_add);
router.delete("/role-remove/:id", authMiddleware, adminController.delete_role);
router.get("/role-get-id/:id", adminController.get_role_by_id);
router.post("/role-edit", authMiddleware,  adminController.edit_role);


// CATEGORIES ROUTE
router.get("/categories-get", adminController.categories_get);
router.post("/category-add", adminController.category_add);




// router.post("/category-add", authMiddleware, categoryController.add_category);
// router.post("/category-edit", authMiddleware, categoryController.edit_category);
// router.post("/category-image-update", authMiddleware, categoryController.edit_category_image);
// router.get("/category-get-id/:id", categoryController.get_category_by_id);



// router.delete("/category-remove/:id", authMiddleware, categoryController.delete_category);

// router.delete("/feature-remove/:id", authMiddleware, categoryController.deleteAdditionalFeature);



// router.post("/location-add", authMiddleware, categoryController.add_location);
// router.get("/location-get", authMiddleware, categoryController.get_location);
// router.get("/locations-get", categoryController.get_locations);
// router.post("/location-edit", categoryController.edit_location);
// router.get("/locations-get-id/:id", categoryController.get_location_by_id);
// router.post("/location-image-update", authMiddleware, categoryController.edit_location_image);
// router.delete("/location-remove/:id", authMiddleware, categoryController.location_delete);

module.exports = router;
