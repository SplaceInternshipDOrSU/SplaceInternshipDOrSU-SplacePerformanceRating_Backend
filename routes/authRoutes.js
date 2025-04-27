const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../middlewares/authMiddleware");
const authControllers = require("../controllers/authControllers");


// ADMIN ROUTES
router.post("/admin-login", authControllers.admin_login);
router.post("/add-new-admin", authControllers.add_new_admin);
router.get("/logout",authMiddleware, authControllers.logout);
// router.put("/admin-change-password", authControllers.change_password);
// router.put("/seller-change-password", authControllers.changePassword_Seller);
router.get("/get-user", authMiddleware, authControllers.getUser);





// USER ROUTES

router.post("/user-register", authControllers.user_registration);
router.post("/user-login", authControllers.user_login);








// router.post("/profile-image-upload",authMiddleware, authControllers.profile_image_upload);
// router.post("/business-image-upload",authMiddleware, authControllers.business_image_upload);
// router.post("/association-image-upload",authMiddleware, authControllers.association_image_upload);



// USERS AUTH ROUTES
// router.post("/-login", authControllers.seller_login);



module.exports = router;
