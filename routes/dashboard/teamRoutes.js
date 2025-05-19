const router = require("express").Router();
const { model } = require("mongoose");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const TeamController = require("../../controllers/dashboard/TeamController");






router.get('/get-supervisors',authMiddleware,TeamController.get_active_supervisor)
router.get('/get-managers',authMiddleware,TeamController.get_active_managers)
router.get('/get-active-ceo',authMiddleware,TeamController.get_active_ceo_coo)
router.get('/get-active-coo',authMiddleware,TeamController.get_active_ceo_coo)
router.get('/get-rf-employee',authMiddleware,TeamController.get_active_rf_emp)



router.post('/team-add',authMiddleware,TeamController.create_team)
router.get("/teams-get", TeamController.teams_get);


module.exports = router;