const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas_ACPController');



router.get('/tareas', tareasController.obtenerTareas); 
router.get('/bloqueos/:id', tareasController.getTareas_id);
router.get('/modificar/:id', tareasController.getTareaporid);
router.get('/obtenerProy', tareasController.getProyectos);
router.get('/obtenerRol', tareasController.getRol);
router.get('/obtenerRolporId/:id', tareasController.getRolporId);
router.get('/obtenerRecurso', tareasController.getRecursos);
router.get('/obtenerRecursoporId/:id', tareasController.getRecursosporId);
router.post('/agregarTarea', tareasController.createTarea);
router.post('/agregarProyecto', tareasController.createProyecto);
router.post('/agregarRol', tareasController.createRol);
router.post('/agregarBloqueo', tareasController.createBloqueo);
router.post('/agregarRecurso', tareasController.createRecurso);
router.put('/finalizar/:id', tareasController.finalizarTarea);
router.put('/modificarTarea/:id', tareasController.updateTarea);
router.put('/modificarRecurso/:id', tareasController.updateRecurso);
router.put('/modificarRol/:id', tareasController.updateRol);
router.delete('/eliminarRol/:id', tareasController.deleteRoles);
router.delete('/eliminarRecurso/:id', tareasController.deleteRecurso);

module.exports = router;