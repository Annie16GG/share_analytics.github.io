// server/controllers/userController.js
const db2 = require("../../config/db");
const db = require("../../config/db_singlestore");
const { v4: uuidv4 } = require("uuid");

exports.obtenerEstudiantes = (req, res) => {
    const query = `SELECT * FROM student_details sd 
                LEFT JOIN grade_details gd ON sd.Grade_Id = gd.Grade_Id
                LEFT JOIN year_details yd ON yd.Year_Id = sd.Year_Id
                LEFT JOIN graduation_details grd ON grd.Student_ID = sd.Student_Id
                ORDER BY sd.Student_Id`;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
  
      // Formatear las fechas y los estados en los resultados
      const formattedResults = results.map((row) => {
        // Formatear Date_Enrolment
        if (row.Date_Enrolment) {
          const date = new Date(row.Date_Enrolment);
          row.Date_Enrolment = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
  
        // Convertir dropped_out a texto
        if (typeof row.dropped_out !== 'undefined') {
          row.dropped_out = row.dropped_out === 1 ? 'Dado de baja' : 'Activo';
        }
  
        return row;
      });
  
      return res.status(200).json(formattedResults);
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

exports.agregarEstud = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const {
      student_name,
      year,
      gender,
      grade_id,
      fees,
      date_enrolment,
      student_satisfaction,
      parent_satisfaction,
    } = req.body;
  
    // Definir la consulta SQL para insertar el nuevo estudiante en la tabla
    const query = `
      INSERT INTO student_details (
        Student_Name,
        Year_Id,
        Gender,
        Grade_Id,
        Fees,
        Date_Enrolment,
        dropped_out,
        student_satisfaction,
        parent_satisfaction
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Ejecutar la consulta, pasando los valores en el mismo orden que en el query
    db.query(
      query,
      [
        student_name,
        year,
        gender,
        grade_id,
        fees,
        date_enrolment,
        0, // Valor predeterminado de dropped_out
        student_satisfaction,
        parent_satisfaction,
      ],
      (err, results) => {
        if (err) {
          // Enviar una respuesta de error en caso de fallo
          return res.status(500).json({ error: err.message });
        }
        // Enviar una respuesta de éxito si la inserción es correcta
        return res.status(201).json({
          message: "Estudiante agregado exitosamente",
          studentId: results.insertId,
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


exports.getEstudianteporid = (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT *
      FROM student_details sd
      LEFT JOIN grade_details gd ON sd.Grade_Id = gd.Grade_Id
      LEFT JOIN year_details yd ON yd.Year_Id = sd.Year_Id
      LEFT JOIN graduation_details grd ON grd.Student_ID = sd.Student_Id
      WHERE sd.Student_Id = ?`;
  
    db.query(query, [id], (err, results) => {
      if (err) {
        console.error("Error al obtener los detalles del estudiante:", err.message);
        return res.status(500).json({ error: "Error al obtener los detalles del estudiante" });
      }
  
      // Si no se encuentra la tarea, devolver un error 404
      if (results.length === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      const formattedResults = results.map((row) => {
        // Formatear Date_Enrolment
        if (row.Date_Enrolment) {
          const date = new Date(row.Date_Enrolment);
          row.Date_Enrolment = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
  
  
        return row;
      });
      // Devolver la primera (y única) tarea encontrada
      return res.status(200).json(formattedResults);
    });
  };
  
  exports.updateStudent = (req, res) => {
    const { id } = req.params; // Obtener el ID del estudiante desde los parámetros de la URL
    const { Student_Name, Year, Gender, Grade_Id, Fees, Date_Enrolment, dropped_out, student_satisfaction, parent_satisfaction } = req.body; // Obtener los datos a actualizar desde el cuerpo de la solicitud
  
    const query = `
      UPDATE student_details 
      SET Student_Name = ?, 
          Year_Id = ?, 
          Gender = ?, 
          Grade_Id = ?, 
          Fees = ?, 
          Date_Enrolment = ?, 
          dropped_out = ?, 
          student_satisfaction = ?, 
          parent_satisfaction = ?
      WHERE Student_Id = ?
    `;
  
    // Ejecutar la consulta con los valores recibidos
    db.query(query, [Student_Name, Year, Gender, Grade_Id, Fees, Date_Enrolment, dropped_out, student_satisfaction, parent_satisfaction, id], (err, results) => {
      if (err) {
        console.error("Error al actualizar los detalles del estudiante:", err.message);
        return res.status(500).json({ error: "Error al actualizar los detalles del estudiante" });
      }
  
      // Si el estudiante no fue encontrado o no se actualizó ninguna fila
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Estudiante no encontrado" });
      }
  
      // Respuesta exitosa
      return res.status(200).json({ message: "Estudiante actualizado exitosamente" });
    });
};

  