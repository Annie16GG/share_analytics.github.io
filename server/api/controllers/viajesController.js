
const db = require('../../config/db');
const db2 = require('../../config/db_singlestore');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

exports.createViaje = (req, res) => {
    console.log(req.body);
    const { placas, viaje, operador, estadoOr, estadoDe, fInicio, fFin, costo, ingreso, carga, estatus } = req.body;
    const nom = `${estadoOr.substring(0, 3).toUpperCase()}-${estadoDe.substring(0, 3).toUpperCase()}`;

    // Primer, inserta en la tabla de Viajes
    const insertQuery = 'INSERT INTO Viajes (V_KeyViaje, V_Operador, V_Placas, V_NOM, V_EstadoOrigen, V_EstadoDestino, V_FInicio, V_FFin, V_Costo, V_Ingreso, V_CargaUtilizada, V_Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(insertQuery, [viaje, operador, placas, nom, estadoOr, estadoDe, fInicio, null, costo, ingreso, carga, estatus], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Luego, actualiza el status de la unidad a "Ocupado"
        const updateQuery = 'UPDATE Unidades SET U_Status = ? WHERE U_Placas = ?';

        db.query(updateQuery, ['Ocupado', placas], (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            return res.status(201).json({ message: 'Viaje creado y unidad actualizada exitosamente' });
        });
    });
};

exports.getViajes_id = (req, res) => {
    const { id } = req.params;
    const query = 'SELECT V_KeyViaje, V_Operador, V_Placas, V_NOM, V_EstadoOrigen, V_EstadoDestino, V_FInicio, V_FFin, V_Costo, V_Ingreso, V_CargaUtilizada, V_Status FROM Viajes WHERE V_Placas = ? AND V_Status = "En entrega"';
  
    db.query(query, [id], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Transformar las fechas a formato 'YYYY-MM-DDTHH:MM'
      results = results.map((viaje) => {
        return {
          ...viaje,
          V_FInicio: formatDateForDatetimeLocal(viaje.V_FInicio)
        };
      });
  
      return res.status(200).json(results);
    });
  };
  
  // Función para transformar la fecha al formato 'YYYY-MM-DDTHH:MM'
  function formatDateForDatetimeLocal(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  exports.updateViajes = (req, res) => {
    const { placas, viaje, fin, status } = req.body;
    const query = `
      UPDATE Viajes
      SET V_FFin = ?, V_Status = ?
      WHERE V_Placas = ? AND V_KeyViaje = ?`;
  
    db.query(query, [fin, status, placas, viaje], (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Viaje no encontrado' });
      }
  
      const updateQuery = 'UPDATE Unidades SET U_Status = ? WHERE U_Placas = ?';
      db.query(updateQuery, ['Disponible', placas], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
  
        // Aquí enviamos la respuesta final
        return res.status(201).json({ message: 'Viaje finalizado y unidad actualizada exitosamente' });
      });
    });
  };
  

  exports.createEvento = (req, res) => {
    console.log(req.body);
    const { placas, tipo, fecha, monto} = req.body;

    // Primer, inserta en la tabla de Viajes
    const insertQuery = 'INSERT INTO Eventos (E_Placas, E_Tipo, E_FechaEvento, E_Monto) VALUES (?, ?, ?, ?)';
    
    db.query(insertQuery, [placas, tipo, fecha, monto], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ message: 'Evento añadido' });
    });
};

// Controlador para insertar los costos
exports.addCostos = (req, res) => {
    const { placas, keyViaje, costos } = req.body;
  
    if (!costos || costos.length === 0) {
      return res.status(400).json({ error: 'No se han proporcionado costos.' });
    }
  
    let errors = [];
    let completedQueries = 0;
  
    // Iterar sobre los costos y realizar las inserciones
    costos.forEach((costo, index) => {
      const { categoria, tipo, monto } = costo;
      const fechaActual = new Date();
  
      console.log(fechaActual);
      const insertQuery = 'INSERT INTO Costos (C_Placas, C_KeyViaje, C_Monto, C_Fecha, C_Categoria, C_Tipo) VALUES (?, ?, ?, ?, ?, ?)';
  
      db.query(insertQuery, [placas, keyViaje, monto, fechaActual, categoria, tipo], (err, results) => {
        completedQueries++;
        console.log(completedQueries);
  
        if (err) {
          errors.push(`Error en costo ${index + 1}: ${err.message}`);
        }
  
        // Solo enviar respuesta cuando todas las consultas hayan terminado
        if (completedQueries === costos.length) {
          if (errors.length > 0) {
            return res.status(500).json({ error: 'Algunos costos no pudieron ser guardados.', details: errors });
          } else {
            return res.status(200).json({ message: 'Costos añadidos con éxito' });
          }
        }
      });
    });
  };
  
  
  

  
  