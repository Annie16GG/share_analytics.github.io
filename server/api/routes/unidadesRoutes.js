const express = require('express');
const router = express.Router();
const unidadesController = require('../controllers/unidadesController');

router.get('/unidades', unidadesController.getUnidades);
router.get('/unidades/:id', unidadesController.getUnidades_id);
router.post('/unidades', unidadesController.createUnidad);
router.put('/unidades/:id', unidadesController.updateUnidad); 
router.delete('/unidades/:id', unidadesController.deleteUnidad);