const db = require("../../config/db");
const db2 = require("../../config/db_singlestore");


exports.getDashboards = (req, res) => {
  const query = "SELECT id, name_dashboard FROM dashboards";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.status(200).json(results);
  });
};

