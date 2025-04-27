const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const userController = require("../../controllers/dashboard/UserController");

router.get('/request-users-get',authMiddleware,userController.get_user_requests)
router.get('/get-user/:userId',authMiddleware,userController.get_user)
router.post('/user-status-update',authMiddleware,userController.user_status_update)





// router.post('/seller-status-update',authMiddleware,sellerController.seller_status_update)

// router.get('/get-sellers',authMiddleware,sellerController.get_active_sellers)
// router.get('/get-deactive-sellers',authMiddleware,sellerController.get_deactive_sellers)

// router.get('/get-seller/:sellerId',authMiddleware,sellerController.get_seller)
// router.post('/seller-status-update',authMiddleware,sellerController.seller_status_update)




// router.get('/request-trader-get',authMiddleware,sellerController.get_trader_request)

// router.get('/get-trader/:traderId',authMiddleware,sellerController.get_trader)
// router.post('/trader-status-update',authMiddleware,sellerController.trader_status_update)
module.exports = router;