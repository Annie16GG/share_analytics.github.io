// const mysql = require('mysql2');

// // Configuración del pool de conexiones
// const pool = mysql.createPool({
//   host: "172.178.34.90",
//   port: 3306,
//   database: "share_analytics2",
//   user: "ShareData",
//   password: "$$Share123+$$",
//   waitForConnections: true,
//   connectionLimit: 10, // Número máximo de conexiones en el pool
//   queueLimit: 0, // Límite de solicitudes en cola (0 para ilimitado)
// });

// // Promisify el pool para usar async/await
// const promisePool = pool.promise();

// // Ejemplo de una consulta
// async function testConnection() {
//   try {
//     const [rows] = await promisePool.query('SELECT 1');
//     console.log('Connection successful:', rows);
//   } catch (err) {
//     console.error('Error connecting to the database:', err);
//   }
// }

// testConnection();

// module.exports = promisePool;













const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: "172.178.34.90",
  port: 3306,
  database: "share_analytics2",
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
