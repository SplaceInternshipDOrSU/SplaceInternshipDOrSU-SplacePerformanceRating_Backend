const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../../../middlewares/authMiddleware");
// const { authMiddleware } = require("../../../middlewares/authMiddleware");
const RatingController = require("../../../controllers/dashboard/RatingController");


router.post('/rate-add',authMiddleware,RatingController.rating_add)
router.get("/rate-get", RatingController.getSelfRating);
router.get("/peer-rating-get", RatingController.getPeerRating);



router.get("/peers-get", RatingController.peersGet);
router.get("/get-peer", RatingController.peerGet);

// router.get("/teams-get", TeamController.teams_get);


module.exports = router;