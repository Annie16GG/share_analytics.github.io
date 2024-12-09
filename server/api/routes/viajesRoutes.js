// server/routes/authRoutes.js
// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const viajesController = require('../controllers/viajesController');



router.post('/viajes', viajesController.createViaje); 
router.post('/eventos', viajesController.createEvento); 
router.post('/costos', viajesController.addCostos);
router.get('/viajes/:id', viajesController.getViajes_id);
router.put('/viajes/:id', viajesController.updateViajes); 

module.exports = router;