const express = require('express');
const router = express.Router();
const agileController = require('../controllers/agileController');



router.get('/tareas', agileController.obtenerTareas); 
router.get('/modificar/:id', agileController.obtenerTareaporId);
router.put('/modificarTask/:id', agileController.updateTask);
router.post('/agregarTask', agileController.agregarTarea);
// router.get('/modificar/:id', estudiantesController.getEstudianteporid);
// router.get('/bloqueos/:id', tareasController.getTareas_id);
// router.post('/agregarBloqueo', tareasController.createBloqueo);

// router.put('/modificarTarea/:id', tareasController.updateTarea);


module.exports = router;