const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

router.get('/permission/access/:selectedEn', permissionController.getAccess);
router.get('/permission/scope', permissionController.getScope);
router.get('/permission/entities', permissionController.getEntities);
// router.get('/permission/groups', permissionController.getGropus);
router.get('/permission/forms', permissionController.getForms);
router.get('/permission/categorias', permissionController.getCategories);

module.exports = router;