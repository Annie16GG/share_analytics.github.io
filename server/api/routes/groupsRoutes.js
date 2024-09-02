const express = require('express');
const router = express.Router();
const groupsController = require('../controllers/groupsController');

router.get('/group', groupsController.getGroups);
router.post('/group/add', groupsController.addGroup);
router.post('/group/update', groupsController.addUsersToGroup);

module.exports = router;