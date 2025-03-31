const db = require("../../config/db_singlestoreKarem");

exports.getDashboards = async (req, res) => {
  const query = "SELECT id, name_dashboard FROM dashboards";
  
  try {
    // Ejecutamos la consulta y esperamos el resultado
    const [results] = await db.query(query);
    
    // Si no hay resultados, podemos devolver un arreglo vacío
    if (!results.length) {
      return res.status(404).json({ message: "No dashboards found" });
    }

    return res.status(200).json(results);
  } catch (err) {
    // En caso de error, respondemos con un mensaje de error
    return res.status(500).json({ error: err.message });
  }
};
