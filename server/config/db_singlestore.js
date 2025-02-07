const mysql = require('mysql2/promise'); // Usar el módulo de promesas
const fs = require('fs');
const path = require('path');

// Ruta al archivo CA bundle
const caBundlePath = path.join(__dirname, 'singlestore_bundle.pem');

// Crear un pool de conexiones con soporte para promesas
const pool = mysql.createPool({
  host: 'svc-c54c488b-3913-4cdf-a6a0-0d65b0c4d23c-dml.aws-oregon-3.svc.singlestore.com',
  port: '3306',
  user: 'admin',
  password: 'qzJFvi1iHJ9Ge1JfjMynX0hXHAxH5q2v',
  database: 'share_analytics',
  ssl: {
    ca: fs.readFileSync(caBundlePath)
  },
  waitForConnections: true,  // Esperar conexiones si el pool está lleno
  connectionLimit: 10,       // Límite de conexiones concurrentes
  queueLimit: 0              // Número de conexiones en cola (0 = ilimitado)
});

(async () => {
  try {
    console.log("Iniciando conexión...");
    const connection = await pool.getConnection(); // Usa `await` para obtener la conexión
    console.log('Connected to the SingleStore database.');

    // Libera la conexión cuando ya no se necesita
    connection.release();
  } catch (err) {
    console.error('Error connecting to the SingleStore database:', err);
  }
})();

module.exports = pool;