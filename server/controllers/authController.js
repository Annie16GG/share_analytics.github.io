const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Configuración del token
const JWT_SECRET = 'tu_clave_secreta'; // Cambia esto por una clave secreta segura
const JWT_EXPIRATION = '1h'; // Tiempo de expiración del token

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  db.query(query, [email, password], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length > 0) {
      const user = results[0];
      console.log(user);
      // Generar token de autenticación
      const token = jwt.sign(
        { id: user.id, role: user.tipo_user, userId: user.id}, // Incluye el rol en el token
        JWT_SECRET,
        { expiresIn: JWT_EXPIRATION }
      );

      return res.status(200).json({ 
        message: 'Login successful', 
        token, 
        role: user.tipo_user,
        userId: user.id// Incluye el rol en la respuesta
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
};

// Función para crear un usuario
exports.createUser = (req, res) => {
  const { name, last_name, email, password, user, status, verification, image_url, tipo_user } = req.body;
  const id = uuidv4();

  const query = 'INSERT INTO users (id, name, last_name, email, password, user, status, verification, image_url, tipo_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [id, name, last_name, email, password, user, status, verification, image_url, tipo_user], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ message: 'User created successfully', userId: id });
  });
};

// Función para actualizar un usuario existente
exports.updateUser = (req, res) => {
  const { id, name, last_name, email, user, status, verification, image_url, tipo_user } = req.body;

  const query = `
    UPDATE users 
    SET name = ?, last_name = ?, email = ?, user = ?, status = ?, verification = ?, image_url = ?, tipo_user = ? 
    WHERE id = ?`;

  db.query(query, [name, last_name, email, user, status, verification, image_url, tipo_user, id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully' });
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  });
};

// Función para obtener los permisos de un usuario
exports.getUserPermissions = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM permissions WHERE id_user = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.deletePermiso = (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM permissions WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    return res.status(200).json({ message: 'Permission deleted successfully' });
  });
};
