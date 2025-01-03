// server/controllers/userController.js
const db = require("../../config/db");
const db2 = require("../../config/db_singlestore");
const { v4: uuidv4 } = require("uuid");

exports.obtenerTareas = (req, res) => {
  const query = "SELECT * FROM Tareas ORDER BY T_KeyTarea";

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

exports.getTareas_id = (req, res) => {
  const { id } = req.params;
  const query = `SELECT T_KeyTarea FROM Tareas WHERE T_KeyTarea = ?`;

  console.log(id);

  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

// Función para crear una tarea en la base de datos
exports.createTarea = (req, res) => {
  // Obtener los datos de la solicitud
  const {
    titulo,
    descripcion,
    proyecto,
    tipo_tarea,
    categoria,
    alcance,
    prioridad,
    asignado,
    estatus,
    puntos,
    fecha_ini,
    sprint,
    fecha_ini_lib,
    fecha_lib_sprint,
    fecha_final,
    entregable,
    satisfaccion,
  } = req.body;
  const id = uuidv4();

  // Definir la consulta SQL para insertar la nueva tarea en la tabla
  const query = `
        INSERT INTO Tareas (T_KeyTarea,
            Titulo, Descripcion, Proyecto, Tipo_tarea, Categoria, Alcance,
            Prioridad, Asignado, Estatus, Puntos_historia, Fecha_inicio_sprint, Key_Sprint,
            Fecha_inicio_lib, Fecha_lib_Sprint, Fecha_final_lib, Entregable, Puntaje_satisfaccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  // Ejecutar la consulta, pasando los valores en el mismo orden que en el query
  db.query(
    query,
    [
      id,
      titulo,
      descripcion,
      proyecto,
      tipo_tarea,
      categoria,
      alcance,
      prioridad,
      asignado,
      estatus,
      puntos,
      fecha_ini,
      sprint,
      fecha_ini_lib,
      fecha_lib_sprint,
      fecha_final,
      entregable,
      satisfaccion,
    ],
    (err, results) => {
      if (err) {
        // Enviar una respuesta de error en caso de fallo
        return res.status(500).json({ error: err.message });
      }
      // Enviar una respuesta de éxito si la inserción es correcta
      return res
        .status(201)
        .json({
          message: "Tarea creada exitosamente",
          tareaId: results.insertId,
        });
    }
  );
};

exports.createBloqueo = (req, res) => {
  const { id_tarea, razon } = req.body;
  const id = uuidv4();
  const query = `
      INSERT INTO TareasBloqueos (B_KeyBloqueo, Razon, B_KeyTarea) VALUES  (?, ?, ?)`;

  db.query(query, [id, razon, id_tarea], (err, results) => {
    if (err) {
      // Enviar una respuesta de error en caso de fallo
      return res.status(500).json({ error: err.message });
    }
    // Enviar una respuesta de éxito si la inserción es correcta
    return res
      .status(201)
      .json({
        message: "Tarea creada exitosamente",
        tareaId: results.insertId,
      });
  });
};

exports.finalizarTarea = (req, res) => {
    console.log(req.body);
  // Ruta para actualizar la fecha de término de una tarea
  const { id } = req.params;
  // Obtener la fecha y hora actual en formato AAAA-MM-DD HH:MM:SS
  const now = new Date();
  const fechaTermino = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  // Consulta SQL para actualizar la fecha de término en la tabla de tareas
  const query = `UPDATE Tareas SET Fecha_termino = ? WHERE T_KeyTarea = ?`;

  // Ejecutar la consulta, pasando los valores necesarios
  db.query(query, [fechaTermino, id], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({
          message: "Error al actualizar la fecha de término",
          error: err.message,
        });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res
      .status(200)
      .json({ message: "Fecha de término actualizada exitosamente" });
  });
};


exports.getTareaporid = (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT *
      FROM Tareas 
      WHERE T_KeyTarea = ?`;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error al obtener los detalles de la tarea:", err.message);
        return res.status(500).json({ error: "Error al obtener los detalles de la tarea" });
      }
  
      // Si no se encuentra la tarea, devolver un error 404
      if (results.length === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      // Devolver la primera (y única) tarea encontrada
      return res.status(200).json(results);
    });
  };
  

  exports.updateTarea = (req, res) => {
    const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
    const { estatust, satist } = req.body; // Obtener los datos a actualizar desde el cuerpo de la solicitud
  
    const query = `
      UPDATE Tareas 
      SET Estatus = ?, 
          Puntaje_satisfaccion = ?
      WHERE T_KeyTarea = ?
    `;
  
    // Ejecutar la consulta con los valores recibidos
    db.query(query, [estatust, satist, id], (err, results) => {
      if (err) {
        console.error("Error al actualizar los detalles de la tarea:", err.message);
        return res.status(500).json({ error: "Error al actualizar los detalles de la tarea" });
      }
  
      // Si la tarea no fue encontrada o no se actualizó ninguna fila
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Tarea no encontrada" });
      }
  
      // Respuesta exitosa
      return res.status(200).json({ message: "Tarea actualizada exitosamente" });
    });
  };
  