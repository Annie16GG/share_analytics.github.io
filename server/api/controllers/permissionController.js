const db = require('../../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getAccess = async (req, res) => {
  const { selectedEn } = req.params;
  const query = `SELECT * FROM access WHERE entity LIKE ?`;

  try {
    const [results] = await db.query(query, [`%${selectedEn}%`]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getScope = async (req, res) => {
  const query = 'SELECT * FROM forms';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getEntities = async (req, res) => {
  const query = 'SELECT * FROM entities';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.addPermission = async (req, res) => {
  const { id_user, entity, scope, access_mode } = req.body;
  const id = uuidv4();

  const query = 'INSERT INTO permissions (id, id_user, entity, scope, access_mode) VALUES (?, ?, ?, ?, ?)';

  try {
    const [results] = await db.query(query, [id, id_user, entity, scope, access_mode]);
    return res.status(201).json({ message: 'Permission created successfully', id_user });
  } catch (err) {
    console.error('Error inserting permission:', err);
    return res.status(500).json({ error: err.message });
  }
};

exports.getPermittedItems = async (req, res) => {
  const { id_user } = req.params;

  const query = `
    SELECT DISTINCT scope 
    FROM permissions 
    WHERE id_user = ?`;

  try {
    const [results] = await db.query(query, [id_user]);
    const permittedScopes = results.map(row => row.scope);

    // Obtener formularios permitidos
    const formsQuery = 'SELECT * FROM forms WHERE name IN (?)';
    const [formsResults] = await db.query(formsQuery, [permittedScopes]);

    // Obtener dashboards permitidos
    const dashboardsQuery = 'SELECT * FROM dashboards WHERE name_dashboard IN (?)';
    const [dashboardsResults] = await db.query(dashboardsQuery, [permittedScopes]);

    return res.status(200).json({
      forms: formsResults,
      dashboards: dashboardsResults
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getGroups = async (req, res) => {
  const query = 'SELECT * FROM grupos';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getForms = async (req, res) => {
  const query = 'SELECT * FROM forms';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const query = 'SELECT * FROM categories';

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
