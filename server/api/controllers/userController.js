const db = require('../../config/db_singlestore');

exports.getUsers = async (req, res) => {
  const query = 'SELECT * FROM users';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUnidades = async (req, res) => {
  const query = `
    SELECT U_Placas, U_Estado, DATE_FORMAT(U_FechaDeCompra, '%Y-%m-%d') AS U_FechaDeCompra, 
           U_CargaMax, U_Status 
    FROM Unidades ORDER BY U_Placas ASC`;

  try {
    const [results] = await db.query(query);
    console.log(results);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUsers_id = async (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM users WHERE id = ?';

  try {
    const [results] = await db.query(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getUnidades_id = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT U_Placas, U_Estado, DATE_FORMAT(U_FechaDeCompra, '%Y-%m-%d') AS U_FechaDeCompra, 
           U_CargaMax, U_Status 
    FROM Unidades WHERE U_Placas = ?`;

  try {
    const [results] = await db.query(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
