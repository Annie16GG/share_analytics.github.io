const db = require('../../config/db_singlestore');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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