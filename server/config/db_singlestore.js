const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Ruta al archivo CA bundle
const caBundlePath = path.join(__dirname, 'singlestore_bundle.pem');

const connection = mysql.createConnection({
  host: 'svc-3482219c-a389-4079-b18b-d50662524e8a-shared-dml.aws-virginia-6.svc.singlestore.com',
  port: '3333',
  user: 'Annie',
  password: '96DCtk3j4FlyeAXEoU1HGei9pIqVJAkK',
  database: 'db_melaniesamantha_d0f3d',
  ssl: {
    ca: fs.readFileSync(caBundlePath)
  }
});

connection.connect((err) => {
    if (err) {
      console.error('Error connecting to the SingleStore database:', err);
      return;
    }
    console.log('Connected to the SingleStore database.');
  });
  
  module.exports = connection;

module.exports = connection;
