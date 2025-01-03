const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantesController');



router.get('/estudiantes', estudiantesController.obtenerEstudiantes); 
router.post('/agregarEstudiante', estudiantesController.agregarEstud);
router.get('/modificar/:id', estudiantesController.getEstudianteporid);
// router.get('/modificar/:id', estudiantesController.getEstudianteporid);
// router.get('/bloqueos/:id', tareasController.getTareas_id);
// router.post('/agregarBloqueo', tareasController.createBloqueo);
router.put('/modificarStudent/:id', estudiantesController.updateStudent);
// router.put('/modificarTarea/:id', tareasController.updateTarea);


module.exports = router;