// server/controllers/userController.js
const db2 = require("../../config/db");
const db = require("../../config/db_singlestore");


// Obtener todos los estudiantes
exports.obtenerEstudiantes = async (req, res) => {
  const query = `
    SELECT * FROM student_details sd
    LEFT JOIN grade_details gd ON sd.Grade_Id = gd.Grade_Id
    LEFT JOIN year_details yd ON yd.Year_Id = sd.Year_Id
    LEFT JOIN graduation_details grd ON grd.Student_ID = sd.Student_Id
    ORDER BY sd.Student_Id
  `;
 
  try {
    const [results] = await db.query(query);

    // Formatear resultados
    const formattedResults = results.map((row) => {
      if (row.Date_Enrolment) {
        const date = new Date(row.Date_Enrolment);
        row.Date_Enrolment = date.toLocaleDateString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      }

      row.dropped_out = row.dropped_out === 1 ? 'Dado de baja' : 'Activo';
      return row;
    });

    res.status(200).json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Agregar un nuevo estudiante
exports.agregarEstud = async (req, res) => {
  const {
    student_name,
    year,
    gender,
    grade_id,
    fees,
    date_enrolment,
    student_satisfaction,
    parent_satisfaction,
    interests,
  } = req.body;

  try {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Insertar en student_details
      const insertStudentQuery = `
        INSERT INTO student_details (
          Student_Name, Year_Id, Gender, Grade_Id, Fees,
          Date_Enrolment, Student_Satisfaction, Parent_Satisfaction
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [studentResult] = await connection.query(insertStudentQuery, [
        student_name,
        year,
        gender,
        grade_id,
        fees,
        date_enrolment,
        student_satisfaction,
        parent_satisfaction,
      ]);

      console.log(req.body);
      const studentId = studentResult.insertId;

      // Insertar en students_marks_details
      const branchInsertValues = interests.map((branchId) => [
        studentId,
        branchId,
        0,
        0,
        0,
      ]);
      const insertBranchQuery = `
        INSERT INTO students_marks_details (
          Student_Id, Branch_Id, Marks, Participation, Days_Abscent
        ) VALUES ?
      `;
      await connection.query(insertBranchQuery, [branchInsertValues]);

      // Insertar en graduation_details
      const insertGraduationQuery = `
        INSERT INTO graduation_details (
          Student_ID, Grade_ID, Graduation_Status
        ) VALUES (?, ?, ?)
      `;
      await connection.query(insertGraduationQuery, [studentId, grade_id, 0]);

      await connection.commit();
      res.status(201).json({
        message: 'Estudiante, ramas y estatus de graduación agregados exitosamente',
        studentId,
      });
    } catch (err) {
      await connection.rollback();
      res.status(500).json({ error: err.message });
    } finally {
      connection.release();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un estudiante por ID
exports.getEstudianteporid = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT * FROM student_details sd
    LEFT JOIN grade_details gd ON sd.Grade_Id = gd.Grade_Id
    LEFT JOIN year_details yd ON yd.Year_Id = sd.Year_Id
    LEFT JOIN graduation_details grd ON grd.Student_ID = sd.Student_Id
    WHERE sd.Student_Id = ?
  `;

  try {
    const [results] = await db.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const formattedResults = results.map((row) => {
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

    res.status(200).json(formattedResults);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar un estudiante
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    Student_Name,
    Year,
    Gender,
    Grade_Id,
    Fees,
    Date_Enrolment,
    dropped_out,
    student_satisfaction,
    parent_satisfaction,
  } = req.body;

  const query = `
    UPDATE student_details
    SET Student_Name = ?, Year_Id = ?, Gender = ?, Grade_Id = ?,
        Fees = ?, Date_Enrolment = ?, dropped_out = ?, 
        student_satisfaction = ?, parent_satisfaction = ?
    WHERE Student_Id = ?
  `;

  try {
    const [results] = await db.query(query, [
      Student_Name,
      Year,
      Gender,
      Grade_Id,
      Fees,
      Date_Enrolment,
      dropped_out,
      student_satisfaction,
      parent_satisfaction,
      id,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.status(200).json({ message: 'Estudiante actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar calificaciones
exports.updateCalif = async (req, res) => {
  const { id } = req.params;
  const { Branch_Id, Marks, Participation, Days_Abscent } = req.body;

  const query = `
    UPDATE students_marks_details
    SET Marks = ?, Participation = ?, Days_Abscent = ?
    WHERE Student_Id = ? AND Branch_Id = ?
  `;

  try {
    const [results] = await db.query(query, [
      Marks,
      Participation,
      Days_Abscent,
      id,
      Branch_Id,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.status(200).json({ message: 'Calificaciones actualizadas exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar graduación
exports.updateGrad = async (req, res) => {
  const { id } = req.params;
  const { studentGrade, studentGradoId} = req.body;

  const query = `
    UPDATE graduation_details
    SET Graduation_Status = ?
    WHERE Student_Id = ? AND Grade_Id = ?
  `;

  try {
    const [results] = await db.query(query, [1, id, studentGradoId]);

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }

    res.status(200).json({ message: 'Estado de graduación actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.agregarProf = async (req, res) => {
  // Obtener los datos de la solicitud
  const {
    grade_id,
    branch_id,
    teacher_name,
    lesson_percentage,
    contact,
    year_id,
    satisfaction_rating,
    salary, // Campo opcional
  } = req.body;

  // Definir la consulta SQL para insertar el nuevo profesor
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

  try {
    // Ejecutar la consulta
    const [result] = await db.query(query, [
      grade_id,
      branch_id,
      teacher_name,
      lesson_percentage,
      contact,
      year_id,
      satisfaction_rating,
      salary,
    ]);

    // Enviar respuesta de éxito
    res.status(201).json({
      message: "Profesor agregado exitosamente",
      teacherId: result.insertId,
    });
  } catch (err) {
    // Manejar errores
    res.status(500).json({ error: err.message });
  }
};

