const db = require('../../config/db');
const db2 = require('../../config/db_singlestore');
const { v4: uuidv4 } = require('uuid');

exports.getAccess = (req, res) => {
  const { selectedEn }  = req.params;
  console.log(req.params);
  const query = `SELECT * FROM access WHERE entity LIKE ?`;
  console.log(query);
  
  db.query(query, [`%${selectedEn}%`], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getScope = (req, res) => {
  const query = 'SELECT * FROM forms';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getEntities = (req, res) => {
  const query = 'SELECT * FROM entities';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.addPermission = (req, res) => {
  const { id_user, entity, scope, access_mode } = req.body;
  const id = uuidv4();

  console.log('Received data:', req.body); // Log de los datos recibidos

  const query = 'INSERT INTO permissions (id, id_user, entity, scope, access_mode) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [id, id_user, entity, scope, access_mode], (err, results) => {
    if (err) {
      console.error('Error inserting permission:', err);
      return res.status(500).json({ error: err.message });
    }
    return res.status(201).json({ message: 'Permission created successfully', id_user });
  });
};

exports.getPermittedItems = (req, res) => {
  const { id_user } = req.params;

  // Consultar los formularios y dashboards a los que el usuario tiene permiso
  const query = `
    SELECT DISTINCT scope 
    FROM permissions 
    WHERE id_user = ?`;

  db.query(query, [id_user], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const permittedScopes = results.map(row => row.scope);
    console.log(permittedScopes);

    // Obtener formularios permitidos
    const formsQuery = 'SELECT * FROM forms WHERE name IN (?)';
    db.query(formsQuery, [permittedScopes], (err, formsResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // Obtener dashboards permitidos
      const dashboardsQuery = 'SELECT * FROM dashboards WHERE name_dashboard IN (?)';
      db.query(dashboardsQuery, [permittedScopes], (err, dashboardsResults) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        // Responder con los resultados
        return res.status(200).json({
          forms: formsResults,
          dashboards: dashboardsResults
        });
      });
    });
  });
};

exports.getGropus = (req, res) => {
  const query = 'SELECT * FROM grupos';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getForms = (req, res) => {
  const query = 'SELECT * FROM forms';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getCategories = (req, res) => {
  const query = 'SELECT * FROM categories';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};