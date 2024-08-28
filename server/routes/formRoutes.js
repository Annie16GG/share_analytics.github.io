const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');

router.get('/forms', formController.getForms);
router.get('/forms/:id', formController.getFormById);
router.post('/forms', formController.addForm); // Asegúrate de que esta línea está incluida
router.post('/forms/submit', formController.submitForm);

module.exports = router;
