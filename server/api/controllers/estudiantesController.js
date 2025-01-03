// server/controllers/userController.js
const db2 = require("../../config/db");
const db = require("../../config/db_singlestore");

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
  const {
    student_name,
    year,
    gender,
    grade_id,
    fees,
    date_enrolment,
    student_satisfaction,
    parent_satisfaction,
    interests, // Arreglo con los IDs de las materias seleccionadas
  } = req.body;

  // Obtener una conexión del pool
  db.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Error al obtener conexión: " + err.message });
    }

    // Iniciar la transacción
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Error al iniciar la transacción: " + err.message });
      }

      // Insertar en student_details
      const insertStudentQuery = `
        INSERT INTO student_details (
          Student_Name,
          Year_Id,
          Gender,
          Grade_Id,
          Fees,
          Date_Enrolment,
          Student_Satisfaction,
          Parent_Satisfaction
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        insertStudentQuery,
        [
          student_name,
          year,
          gender,
          grade_id,
          fees,
          date_enrolment,
          student_satisfaction,
          parent_satisfaction,
        ],
        (err, studentResult) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return res.status(500).json({ error: "Error al insertar el estudiante: " + err.message });
            });
          }

          const studentId = studentResult.insertId;

          // Preparar los valores para insertar en student_branch
          const branchInsertValues = interests.map((branchId) => [
            studentId,
            branchId,
            0, // Marks
            0, // Participation
            0, // Days_Abscent
          ]);

          const insertBranchQuery = `
            INSERT INTO students_marks_details (
              Student_Id,
              Branch_Id,
              Marks,
              Participation,
              Days_Abscent
            ) VALUES ?
          `;

          connection.query(insertBranchQuery, [branchInsertValues], (err) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                return res.status(500).json({ error: "Error al insertar en Student_Branch: " + err.message });
              });
            }

            // Insertar en students_graduation_status
            const insertGraduationQuery = `
              INSERT INTO graduation_details (
                Student_ID,
                Grade_ID,
                Graduation_Status
              ) VALUES (?, ?, ?)
            `;

            connection.query(insertGraduationQuery, [studentId, grade_id, 0], (err) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  return res.status(500).json({ error: "Error al insertar en Graduation_Status: " + err.message });
                });
              }

              // Confirmar la transacción
              connection.commit((err) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    return res.status(500).json({ error: "Error al confirmar la transacción: " + err.message });
                  });
                }

                connection.release();
                res.status(201).json({
                  message: "Estudiante, ramas y estatus de graduación agregados exitosamente",
                  studentId,
                });
              });
            });
          });
        }
      );
    });
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

exports.updateCalif = (req, res) => {
  const { id } = req.params; // Obtener el ID del estudiante desde los parámetros de la URL
  const { Branch_Id, Marks, Participation, Days_Abscent } = req.body; // Obtener los datos a actualizar desde el cuerpo de la solicitud

  const query = `
    UPDATE students_marks_details 
    SET Marks = ?, 
        Participation = ?, 
        Days_Abscent = ?
    WHERE Student_Id = ? AND
    Branch_Id = ?
  `;

  // Ejecutar la consulta con los valores recibidos
  db.query(query, [Marks, Participation, Days_Abscent, id, Branch_Id,], (err, results) => {
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

exports.updateGrad = (req, res) => {
  const { id } = req.params; // Obtener el ID del estudiante desde los parámetros de la URL
  const { studentGrade} = req.body; // Obtener los datos a actualizar desde el cuerpo de la solicitud

  const query = `
    UPDATE graduation_details 
    SET Graduation_Status = ?
    WHERE Student_ID = ? AND
    Grade_ID = ?
  `;

  // Ejecutar la consulta con los valores recibidos
  db.query(query, [1, id, studentGrade], (err, results) => {
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


exports.agregarProf = (req, res) => {
  // Obtener los datos de la solicitud
  const {
    grade_id,
      branch_id,
      teacher_name,
      lesson_percentage,
      contact,
      year_id,
      satisfaction_rating,
      salary // Si se requiere este campo, aún se puede agregar en el futuro
  } = req.body;

  // Definir la consulta SQL para insertar el nuevo estudiante en la tabla
  const query = `
    INSERT INTO faculty_details (
      Grade_ID,
      Branch_Id,
      Teacher_Name,
      Lesson_Percentage,
      Contact,
      Year_Id,
      Satisfaction_Rating,
      salary
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecutar la consulta, pasando los valores en el mismo orden que en el query
  db.query(
    query,
    [
      grade_id,
      branch_id,
      teacher_name,
      lesson_percentage,
      contact,
      year_id,
      satisfaction_rating,
      salary
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
