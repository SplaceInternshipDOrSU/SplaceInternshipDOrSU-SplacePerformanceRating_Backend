const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const TeamController = require("../../controllers/dashboard/TeamController");






router.get('/get-supervisors',authMiddleware,TeamController.get_active_supervisor)
router.get('/get-managers',authMiddleware,TeamController.get_active_managers)
router.get('/get-rf-employee',authMiddleware,TeamController.get_active_rf_emp)



router.get('/add-team',authMiddleware,TeamController.get_user_requests)




// router.post('/user-status-update',authMiddleware,userController.user_status_update)
// router.get('/get-users',authMiddleware,userController.get_active_users)





// router.post('/seller-status-update',authMiddleware,sellerController.seller_status_update)

// router.get('/get-sellers',authMiddleware,sellerController.get_active_sellers)
// router.get('/get-deactive-sellers',authMiddleware,sellerController.get_deactive_sellers)

// router.get('/get-seller/:sellerId',authMiddleware,sellerController.get_seller)
// router.post('/seller-status-update',authMiddleware,sellerController.seller_status_update)




// router.get('/request-trader-get',authMiddleware,sellerController.get_trader_request)

// router.get('/get-trader/:traderId',authMiddleware,sellerController.get_trader)
// router.post('/trader-status-update',authMiddleware,sellerController.trader_status_update)
module.exports = router;