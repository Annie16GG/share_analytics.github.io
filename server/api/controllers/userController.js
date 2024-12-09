// server/controllers/userController.js
const db = require('../../config/db_singlestore');

exports.getUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getUnidades = (req, res) => {
  const query = `
    SELECT U_Placas, U_Estado, DATE_FORMAT(U_FechaDeCompra, '%Y-%m-%d') AS U_FechaDeCompra, 
           U_CargaMax, U_Status 
    FROM Unidades ORDER BY U_Placas ASC`;
  
  db.query(query, (err, results) => {
    console.log(results);
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};


exports.getUsers_id = (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getUnidades_id = (req, res) => {
  const { id } = req.params;
  const query = `SELECT U_Placas, U_Estado, DATE_FORMAT(U_FechaDeCompra, '%Y-%m-%d') AS U_FechaDeCompra, 
           U_CargaMax, U_Status FROM Unidades WHERE U_Placas = ?`;
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

