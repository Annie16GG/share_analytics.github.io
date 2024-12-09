const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas_ACPController');



router.get('/tareas', tareasController.obtenerTareas); 
router.get('/bloqueos/:id', tareasController.getTareas_id);
router.get('/modificar/:id', tareasController.getTareaporid);
router.post('/agregarTarea', tareasController.createTarea);
router.post('/agregarBloqueo', tareasController.createBloqueo);
router.put('/finalizar/:id', tareasController.finalizarTarea);
router.put('/modificarTarea/:id', tareasController.updateTarea);
// router.post('/eventos', viajesController.createEvento); 
// router.post('/costos', viajesController.addCostos);
// router.get('/viajes/:id', viajesController.getViajes_id);
// router.put('/viajes/:id', viajesController.updateViajes); 

module.exports = router;