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


module.exports = router;
