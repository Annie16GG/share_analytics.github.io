const express = require('express');
const router = express.Router();
const dashController = require('../controllers/dashboardController');

router.get('/dashboards', dashController.getDashboards);


module.exports = router;
