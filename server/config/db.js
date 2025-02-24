// // dbConnection.js
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
//   queueLimit: 0 // No limita la cola de conexiones
// });

// // Usamos .promise() para poder usar promesas
// const promisePool = pool.promise();

// module.exports = promisePool;