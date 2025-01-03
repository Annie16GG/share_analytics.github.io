// server/controllers/userController.js
const db2 = require("../../config/db");
const db = require("../../config/db_singlestore");
const { v4: uuidv4 } = require("uuid");

exports.obtenerTareas = (req, res) => {
    const query = `SELECT * FROM Agile_Team_Management_Data ORDER BY Task_ID`;
  
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      console.log(results);


      const formattedResults = results.map((row) => {
        // Formatear Date_Enrolment
        if (row.Assigned_Date) {
          const date = new Date(row.Assigned_Date);
          row.Assigned_Date = date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
        }
  
        return row;
      });
      return res.status(200).json(formattedResults);
    });
  };
  exports.agregarTarea = (req, res) => {
    // Obtener los datos del cuerpo de la solicitud
    const {
      proyect_type,
      team_member,
      task_status,
      task_type,
      task_story_points,
      resource_role,
      assigned_date,
      closed_date,
      planned_hours,
      worked_hours,
      task_priority,
      total_resource
    } = req.body;
  console.log(proyect_type);
    // Definir la consulta SQL para insertar la nueva tarea en la tabla
    const query = `
      INSERT INTO Agile_Team_Management_Data (
        Proyect_Type,
        Team_Member,
        Task_Status,
        Task_Type,
        Task_StoryPoints,
        Resource_Role,
        Assigned_Date,
        Closed_Date,
        Planned_Hours,
        Worked_Hours,
        Task_Priority,
        Total_Resource,
        Score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
  
    // Ejecutar la consulta, pasando los valores en el mismo orden que en el query
    db.query(
      query,
      [
        proyect_type,
      team_member,
      task_status,
      task_type,
      task_story_points,
      resource_role,
      assigned_date,
      closed_date,
      planned_hours,
      worked_hours,
      task_priority,
      total_resource,
      0
      ],
      (err, results) => {
        if (err) {
          // Enviar una respuesta de error en caso de fallo
          return res.status(500).json({ error: err.message });
        }
        // Enviar una respuesta de éxito si la inserción es correcta
        return res.status(201).json({
          message: "Tarea agregada exitosamente",
          taskId: results.insertId,
        });
      }
    );
};


exports.obtenerTareaporId = (req, res) => {
    const { id } = req.params;
    const query = `
      SELECT *
      FROM Agile_Team_Management_Data
      WHERE Task_ID = ?`;
  
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
  
  exports.updateTask = (req, res) => {
    const { id } = req.params; // Obtener el ID de la tarea desde los parámetros de la URL
    const { Proyect_Type, Team_Member, Task_Status, Task_Type, Task_StoryPoints, Resource_Role, Assigned_Date, Closed_Date, Planned_Hours, Worked_Hours, Task_Priority, Total_Resource, Score } = req.body; // Obtener los datos a actualizar desde el cuerpo de la solicitud

    console.log(id);
    const query = `
      UPDATE Agile_Team_Management_Data
      SET Proyect_Type = ?, 
          Team_Member = ?, 
          Task_Status = ?, 
          Task_Type = ?, 
          Task_StoryPoints = ?, 
          Resource_Role = ?, 
          Assigned_Date = ?, 
          Closed_Date = ?, 
          Planned_Hours = ?, 
          Worked_Hours = ?, 
          Task_Priority = ?, 
          Total_Resource = ?, 
          Score = ?
      WHERE Task_ID = ?
    `;
  
    // Ejecutar la consulta con los valores recibidos
    db.query(query, [Proyect_Type, Team_Member, Task_Status, Task_Type, Task_StoryPoints, Resource_Role, Assigned_Date, Closed_Date, Planned_Hours, Worked_Hours, Task_Priority, Total_Resource, Score, id], (err, results) => {
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


  