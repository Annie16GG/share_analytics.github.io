// server/controllers/userController.js
// const db2 = require("../../config/db");
const db = require("../../config/db_singlestore");
const { v4: uuidv4 } = require("uuid");

exports.obtenerTareas = async (req, res) => {
  try {
    const query = `SELECT * FROM Agile_Team_Management_Data ORDER BY Task_ID`;
    const [results] = await db.query(query); // <-- Usar `await` y destructurar el resultado
    
    // Formatear Assigned_Date si existe
    const formattedResults = results.map((row) => {
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

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.agregarTarea = async (req, res) => {
  try {
    const {
      proyect_type, team_member, task_status, task_type, task_story_points,
      resource_role, assigned_date, closed_date, planned_hours,
      worked_hours, task_priority, total_resource
    } = req.body;

    const query = `
      INSERT INTO Agile_Team_Management_Data (
        Proyect_Type, Team_Member, Task_Status, Task_Type, Task_StoryPoints,
        Resource_Role, Assigned_Date, Closed_Date, Planned_Hours,
        Worked_Hours, Task_Priority, Total_Resource, Score
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      proyect_type, team_member, task_status, task_type, task_story_points,
      resource_role, assigned_date, closed_date, planned_hours,
      worked_hours, task_priority, total_resource, 0
    ]);

    res.status(201).json({
      message: "Tarea agregada exitosamente",
      taskId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.obtenerTareaporId = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `SELECT * FROM Agile_Team_Management_Data WHERE Task_ID = ?`;
    
    const [results] = await db.query(query, [id]); // <-- Usar `await` correctamente

    if (results.length === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Formatear fechas si es necesario
    const formattedResults = results.map(row => {
      if (row.Assigned_Date) {
        row.Assigned_Date = new Date(row.Assigned_Date).toLocaleDateString('es-ES', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
      }
      return row;
    });

    res.status(200).json(formattedResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
  
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { Proyect_Type, Team_Member, Task_Status, Task_Type, Task_StoryPoints, Resource_Role, Assigned_Date, Closed_Date, Planned_Hours, Worked_Hours, Task_Priority, Total_Resource, Score } = req.body;

    const query = `
      UPDATE Agile_Team_Management_Data
      SET Proyect_Type = ?, Team_Member = ?, Task_Status = ?, Task_Type = ?, 
          Task_StoryPoints = ?, Resource_Role = ?, Assigned_Date = ?, Closed_Date = ?, 
          Planned_Hours = ?, Worked_Hours = ?, Task_Priority = ?, Total_Resource = ?, Score = ?
      WHERE Task_ID = ?
    `;

    const [result] = await db.query(query, [Proyect_Type, Team_Member, Task_Status, Task_Type, Task_StoryPoints, Resource_Role, Assigned_Date, Closed_Date, Planned_Hours, Worked_Hours, Task_Priority, Total_Resource, Score, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.status(200).json({ message: "Tarea actualizada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



  