const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "172.178.34.90",
  port: 3306,
  database: "dvh",
  user: "ShareData",
  password: "$$Share123+$$"
});

// Conexión a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Exportación de la conexión
module.exports = connection;
