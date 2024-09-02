// server/routes/authRoutes.js
// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

// Asegúrate de que la ruta es '/login' y no '../login'
router.post('/login', authController.login);
router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUsers_id);
router.post('/users', authController.createUser); 
router.put('/users/:id', authController.updateUser); 
router.delete('/users/:id', authController.deleteUser);
router.get('/permisos/:id', authController.getUserPermissions);
router.delete('/permisos/:id', authController.deletePermiso);

module.exports = router;