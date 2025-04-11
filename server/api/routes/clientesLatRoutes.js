const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesLatController');

// Asegúrate de que la ruta es '/login' y no '../login'
router.get('/obtenerClientes/:id', clientesController.getClientes);
router.get('/obtenerCuenta/:id', clientesController.getCuentaById);
router.post('/subirClientes', clientesController.agregarCuenta);
router.put('/actualizarCliente/:id', clientesController.updateCuenta); 
// router.delete('/users/:id', authController.deleteUser);
// router.get('/permisos/:id', authController.getUserPermissions);
// router.delete('/permisos/:id', authController.deletePermiso);
// router.post('/permission/add', authController.addPermission);
// router.get('/permitted-items/:id_user', authController.getPermittedItems);

module.exports = router;