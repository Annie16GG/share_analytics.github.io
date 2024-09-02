const express = require('express');
const router = express.Router();
const boldbiController = require('../controllers/boldbiController');

router.get('/dash', boldbiController.getDashboards);

module.exports = router;
