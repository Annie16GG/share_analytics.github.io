const db = require('../../config/db_singlestore');
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
