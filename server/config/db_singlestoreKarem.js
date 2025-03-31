const mysql = require('mysql2/promise'); // Usar el módulo de promesas
const fs = require('fs');
const path = require('path');

// Ruta al archivo CA bundle
const caBundlePath = path.join(__dirname, 'singlestore_bundle.pem');

// Crear un pool de conexiones con soporte para promesas
const pool = mysql.createPool({
  host: 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com',
  port: '3333',
  user: 'melanie samantha-6c504',
  password: 'L2J1RDu8E0U2I2VzAqp36OB9VjeOXRFC',
  database: 'db_karem_6dd96',
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