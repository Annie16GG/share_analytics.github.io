const express = require('express');
const router = express.Router();
const estudiantesController = require('../controllers/estudiantesController');



router.get('/estudiantes', estudiantesController.obtenerEstudiantes); 
router.post('/agregarEstudiante', estudiantesController.agregarEstud);
router.post('/agregarProfesor', estudiantesController.agregarProf);
router.get('/modificar/:id', estudiantesController.getEstudianteporid);
router.put('/modificarStudent/:id', estudiantesController.updateStudent);
router.put('/modificarCalif/:id', estudiantesController.updateCalif);
router.put('/graduacion/:id', estudiantesController.updateGrad);


module.exports = router;