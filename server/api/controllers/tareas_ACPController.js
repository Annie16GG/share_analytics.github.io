const db = require("../../config/db");
const { v4: uuidv4 } = require("uuid");

exports.obtenerTareas = async (req, res) => {
  const query = "SELECT * FROM Tareas ORDER BY T_KeyTarea";

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getTareas_id = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT T_KeyTarea FROM Tareas WHERE T_KeyTarea = ?`;

  try {
    const [results] = await db.query(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createTarea = async (req, res) => {
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

  const query = `
        INSERT INTO Tareas (T_KeyTarea,
            Titulo, Descripcion, Proyecto, Tipo_tarea, Categoria, Alcance,
            Prioridad, Asignado, Estatus, Puntos_historia, Fecha_inicio_sprint, Key_Sprint,
            Fecha_inicio_lib, Fecha_lib_Sprint, Fecha_final_lib, Entregable, Puntaje_satisfaccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  try {
    const [results] = await db.query(query, [
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
    ]);
    return res.status(201).json({
      message: "Tarea creada exitosamente",
      tareaId: results.insertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createBloqueo = async (req, res) => {
  const { id_tarea, razon } = req.body;
  const id = uuidv4();
  const query = `
      INSERT INTO TareasBloqueos (B_KeyBloqueo, Razon, B_KeyTarea) VALUES  (?, ?, ?)
    `;

  try {
    const [results] = await db.query(query, [id, razon, id_tarea]);
    return res.status(201).json({
      message: "Bloqueo creado exitosamente",
      bloqueoId: results.insertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.finalizarTarea = async (req, res) => {
  const { id } = req.params;
  const now = new Date();
  const fechaTermino = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
    now.getHours()
  ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(
    now.getSeconds()
  ).padStart(2, "0")}`;

  const query = `UPDATE Tareas SET Fecha_termino = ? WHERE T_KeyTarea = ?`;

  try {
    const [result] = await db.query(query, [fechaTermino, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    return res.status(200).json({ message: "Fecha de término actualizada exitosamente" });
  } catch (err) {
    return res.status(500).json({ message: "Error al actualizar la fecha de término", error: err.message });
  }
};

exports.getTareaporid = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM Tareas WHERE T_KeyTarea = ?`;

  try {
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.status(200).json(results);
  } catch (err) {
    console.error("Error al obtener los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al obtener los detalles de la tarea" });
  }
};

exports.updateTarea = async (req, res) => {
  const { id } = req.params;
  const { estatust, satist } = req.body;

  const query = `
    UPDATE Tareas
    SET Estatus = ?, 
        Puntaje_satisfaccion = ?
    WHERE T_KeyTarea = ?
  `;

  try {
    const [results] = await db.query(query, [estatust, satist, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.status(200).json({ message: "Tarea actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al actualizar los detalles de la tarea" });
  }
};
