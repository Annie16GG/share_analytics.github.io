const db2 = require("../../config/db");
const db = require("../../config/db_singlestoreKarem");
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
    rol,
    estatus,
    puntos,
    fechaIE,
    fechaFE,
    horas_estimadas,
    fecha_ini,
    sprint,
    fecha_ini_lib,
    fecha_lib_sprint,
    fecha_final,
    entregable,
    satisfaccion,
  } = req.body;

  const id = uuidv4();

  // Validar y asignar valores por defecto
  const puntosFinal = puntos === " " || puntos === "" ? 0.0 : puntos;
  const satisfaccionFinal = satisfaccion === " " || satisfaccion === "" ? 0.0 : satisfaccion;

  const fechaIEFinal = fechaIE === " " || fechaIE === "" ? null : fechaIE;
  const fechaFEFinal = fechaFE === " " || fechaFE === "" ? null : fechaFE;
  const fechaIniFinal = fecha_ini === " " || fecha_ini === "" ? null : fecha_ini;
  const fechaIniLibFinal = fecha_ini_lib === " " || fecha_ini_lib === "" ? null : fecha_ini_lib;
  const fechaLibSprintFinal = fecha_lib_sprint === " " || fecha_lib_sprint === "" ? null : fecha_lib_sprint;
  const fechaFinalFinal = fecha_final === " " || fecha_final === "" ? null : fecha_final;

  const query = `
        INSERT INTO Tareas (T_KeyTarea,
            Titulo, Descripcion, Proyecto, Tipo_tarea, Categoria, Alcance,
            Prioridad, Asignado, Rol, Estatus, Puntos_historia, Fecha_inicio_estimada, Fecha_fin_estimada, Horas_estimadas, Fecha_inicio_sprint, Key_Sprint,
            Fecha_inicio_lib, Fecha_lib_Sprint, Fecha_final_lib, Entregable, Puntaje_satisfaccion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      rol,
      estatus,
      puntosFinal,
      fechaIEFinal,
      fechaFEFinal,
      horas_estimadas,
      fechaIniFinal,
      sprint,
      fechaIniLibFinal,
      fechaLibSprintFinal,
      fechaFinalFinal,
      entregable,
      satisfaccionFinal,
    ]);
    return res.status(201).json({
      message: "Tarea creada exitosamente",
      tareaId: results.insertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};



exports.createRecurso = async (req, res) => {
  const {
    recurso,
    fecha_inicio,
    fecha_fin,
    rol
  } = req.body;
  const id = uuidv4();

  const query = `
        INSERT INTO recursos_acp (ID_Recurso, Nombre_Recurso, Fecha_inicio, Fecha_fin, Rol) VALUES (?, ?, ?, ?, ?)
    `;

  try {
    const [results] = await db.query(query, [
      id,
      recurso, 
      fecha_inicio,
      fecha_fin,
      rol
    ]);
    return res.status(201).json({
      message: "Recurso creado exitosamente",
      tareaId: results.insertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createProyecto = async (req, res) => {
  const {
    proyecto,
    responsable
  } = req.body;
  const id = uuidv4();

  const query = `
        INSERT INTO proyectos_ACP (ID_Proyecto,Nombre_Proyecto,Responsable) VALUES (?, ?, ?)
    `;

  try {
    const [results] = await db.query(query, [
      id,
      proyecto,
      responsable
    ]);
    return res.status(201).json({
      message: "Proyecto creado exitosamente",
      tareaId: results.insertId,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.createRol = async (req, res) => {
  const {
    rol,
    tarifa
  } = req.body;
  const id = uuidv4();

  const query = `
        INSERT INTO rol_acp (ID_Rol,Nombre_Rol,Tarifa) VALUES (?, ?, ?)
    `;

  try {
    const [results] = await db.query(query, [
      id,
      rol,
      tarifa
    ]);
    return res.status(201).json({
      message: "Rol creado exitosamente",
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
      INSERT INTO tareasbloqueos (B_KeyBloqueo, Razon, B_KeyTarea) VALUES  (?, ?, ?)
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

    // Formatear las fechas en el formato yyyy-mm-dd
    const formattedResults = results.map((result) => {
      const formatDate = (date) => {
        if (!date) return null; // Manejo de valores nulos o indefinidos
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      return {
        ...result,
        Fecha_termino: formatDate(result.Fecha_termino),
        Fecha_inicio_sprint: formatDate(result.Fecha_inicio_sprint),
        Fecha_inicio_lib: formatDate(result.Fecha_inicio_lib),
        Fecha_lib_Sprint: formatDate(result.Fecha_lib_Sprint),
        Fecha_final_lib: formatDate(result.Fecha_final_lib),
        Fecha_inicio_estimada: formatDate(result.Fecha_inicio_estimada),
        Fecha_fin_estimada: formatDate(result.Fecha_fin_estimada),
      };
    });

    return res.status(200).json(formattedResults);
  } catch (err) {
    console.error("Error al obtener los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al obtener los detalles de la tarea" });
  }
};


exports.updateTarea = async (req, res) => {
  const { id } = req.params;
  const {
    titulot,
    descripciont,
    proyectot,
    tipot,
    categoriat,
    alcancet,
    prioridadt,
    asignadot,
    rolt,
    puntost,
    inicioE,
    finE,
    hestimadas,
    inicios,
    sprint,
    iniciol,
    libsprint,
    finall,
    entregable,
    satist,
    estatust,
  } = req.body;

  // Validar y asignar valores por defecto
  const puntosFinal = puntost === " " || puntost === "" ? 0.0 : puntost;
  const satisfaccionFinal = satist === " " || satist === "" ? 0.0 : satist;

  const inicioEFinal = inicioE === " " || inicioE === "" ? null : inicioE;
  const finEFinal = finE === " " || finE === "" ? null : finE;
  const iniciosFinal = inicios === " " || inicios === "" ? null : inicios;
  const iniciolFinal = iniciol === " " || iniciol === "" ? null : iniciol;
  const libsprintFinal = libsprint === " " || libsprint === "" ? null : libsprint;
  const finallFinal = finall === " " || finall === "" ? null : finall;

  const query = `
    UPDATE Tareas
    SET 
      Titulo = ?,
      Descripcion = ?,
      Proyecto = ?,
      Tipo_tarea = ?,
      Categoria = ?,
      Alcance = ?,
      Prioridad = ?,
      Asignado = ?,
      Rol = ?,
      Estatus = ?, 
      Puntos_historia = ?,
      Fecha_inicio_estimada = ?,
      Fecha_fin_estimada = ?,
      Horas_estimadas = ?,
      Fecha_inicio_sprint = ?,
      Key_Sprint = ?,
      Fecha_inicio_lib = ?,
      Fecha_lib_Sprint = ?,
      Fecha_final_lib = ?,
      Entregable = ?,
      Puntaje_satisfaccion = ?
    WHERE T_KeyTarea = ?
  `;

  try {
    const [results] = await db.query(query, [
      titulot,
      descripciont,
      proyectot,
      tipot,
      categoriat,
      alcancet,
      prioridadt,
      asignadot,
      rolt,
      estatust,
      puntosFinal, // Validación aplicada
      inicioEFinal, // Validación aplicada
      finEFinal,    // Validación aplicada
      hestimadas,
      iniciosFinal, // Validación aplicada
      sprint,
      iniciolFinal, // Validación aplicada
      libsprintFinal, // Validación aplicada
      finallFinal,    // Validación aplicada
      entregable,
      satisfaccionFinal, // Validación aplicada
      id,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.status(200).json({ message: "Tarea actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al actualizar los detalles de la tarea" });
  }
};


exports.updateRecurso = async (req, res) => {
  const { id } = req.params;
  const { recurso_name, recurso_fi, recurso_ff} = req.body;

  const query = `
    UPDATE recursos_acp
    SET 
      Nombre_Recurso = ?,
      Fecha_inicio = ?,
      Fecha_fin = ?
    WHERE ID_Recurso = ?
  `;

  try {
    const [results] = await db.query(query, [recurso_name, recurso_fi, recurso_ff, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.status(200).json({ message: "Tarea actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al actualizar los detalles de la tarea" });
  }
};

exports.updateRol = async (req, res) => {
  const { id } = req.params;
  const { rol_name, rol_tarifa} = req.body;

  const query = `
    UPDATE rol_acp
    SET 
      Nombre_Rol = ?,
      Tarifa = ?
    WHERE ID_Rol = ?
  `;

  console.log(id);
  try {
    const [results] = await db.query(query, [rol_name, rol_tarifa, id]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    return res.status(200).json({ message: "Tarea actualizada exitosamente" });
  } catch (err) {
    console.error("Error al actualizar los detalles de la tarea:", err.message);
    return res.status(500).json({ error: "Error al actualizar los detalles de la tarea" });
  }
};

exports.getRol= async (req, res) => {
  const query = `SELECT * FROM rol_acp`;

  try {
    const [results] = await db.query(query);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getRolporId = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM rol_acp WHERE ID_Rol = ?`;

  try {
    const [results] = await db.query(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getRecursos = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM recursos_acp`;

  try {
    const [results] = await db.query(query, [id]);

    // Si hay resultados, formateamos las fechas
    const formattedResults = results.map((row) => {
      if (row.Fecha_inicio) {
        row.Fecha_inicio = new Date(row.Fecha_inicio).toISOString().split('T')[0];
      }
      if (row.Fecha_fin) {
        row.Fecha_fin = new Date(row.Fecha_fin).toISOString().split('T')[0];
      }
      return row;
    });

    return res.status(200).json(formattedResults);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getRecursosporId = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM recursos_acp WHERE ID_Recurso = ?`;

  try {
    const [results] = await db.query(query, [id]);

    // Si hay resultados, formateamos las fechas
    const formattedResults = results.map((row) => {
      if (row.Fecha_inicio) {
        row.Fecha_inicio = new Date(row.Fecha_inicio).toISOString().split('T')[0];
      }
      if (row.Fecha_fin) {
        row.Fecha_fin = new Date(row.Fecha_fin).toISOString().split('T')[0];
      }
      return row;
    });

    return res.status(200).json(formattedResults);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.getProyectos = async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM proyectos_ACP`;

  try {
    const [results] = await db.query(query, [id]);
    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteRoles = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM rol_acp WHERE ID_Rol = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Rol not found' });
    }
    return res.status(200).json({ message: 'Rol deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.deleteRecurso = async (req, res) => {
  const { id } = req.params;

  const query = 'DELETE FROM recursos_acp WHERE ID_Recurso = ?';

  try {
    const [results] = await db.execute(query, [id]);
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Recurso not found' });
    }
    return res.status(200).json({ message: 'Recurso deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};