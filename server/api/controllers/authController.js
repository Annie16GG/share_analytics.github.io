// Importar el pool desde dbConnection.js
const db = require('../../config/db_singlestore');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

// Configuración del token
const JWT_SECRET = 'tu_clave_secreta'; // Cambia esto por una clave secreta segura
const JWT_EXPIRATION = '1h'; // Tiempo de expiración del token

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';

  try {
    const [results] = await db.execute(query, [email, password]);
    if (results.length > 0) {
      const user = results[0];
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
        userId: user.id // Incluye el rol en la respuesta
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Función para crear un usuario
exports.createUser = async (req, res) => {
  const { name, last_name, email, password, user, status, verification, image_url, tipo_user } = req.body;
  const id = uuidv4();

  const query = 'INSERT INTO users (id, name, last_name, email, password, user, status, verification, image_url, tipo_user) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    await db.execute(query, [id, name, last_name, email, password, user, status, verification, image_url, tipo_user]);
    return res.status(201).json({ message: 'User created successfully', userId: id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createUnidad = async (req, res) => {
  const { placas, estado, fecha, carga } = req.body;
  const estatus = "Disponible"; 

  const query = 'INSERT INTO Unidades (U_Placas, U_Estado, U_FechaDeCompra, U_CargaMax, U_Status) VALUES (?, ?, ?, ?, ?)';

  try {
    await db.execute(query, [placas, estado, fecha, carga, estatus]);
    return res.status(201).json({ message: 'Unidad añadida exitosamente', unidadId: placas });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Función para actualizar un usuario existente
exports.updateUser = async (req, res) => {
  const { id, name, last_name, email, user, status, verification, image_url, tipo_user } = req.body;

  const query = `
    UPDATE users 
    SET name = ?, last_name = ?, email = ?, user = ?, status = ?, verification = ?, image_url = ?, tipo_user = ? 
    WHERE id = ?`;

  try {
    const [results] = await db.execute(query, [name, last_name, email, user, status, verification, image_url, tipo_user, id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateUnidad = async (req, res) => {
  const { placas, estado, fecha, carga, status } = req.body;
  const query = `
    UPDATE Unidades
    SET U_Estado = ?, U_FechaDeCompra = ?, U_CargaMax = ?, U_Status = ?
    WHERE U_Placas = ?`;

  try {
    const [results] = await db.execute(query, [estado, fecha, carga, status, placas]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Unidad no encontrada' });
    }
    return res.status(200).json({ message: 'Unidad actualizada satisfactoriamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM users WHERE id = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteUnidad = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM Unidades WHERE U_Placas = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Unidad no encontrada' });
    }
    return res.status(200).json({ message: 'Unidad eliminada satisfactoriamente' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Función para obtener los permisos de un usuario
exports.getUserPermissions = async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM permissions WHERE id_user = ?';

  try {
    const [results] = await db.execute(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deletePermiso = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM permissions WHERE id = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    return res.status(200).json({ message: 'Permission deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
