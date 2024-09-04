const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Ruta al archivo CA bundle
const caBundlePath = path.join(__dirname, 'singlestore_bundle.pem');

const connection = mysql.createConnection({
  host: 'svc-b845e011-115a-40f4-bea9-2c3d85c359f8-dml.aws-virginia-6.svc.singlestore.com',
  port: '3306',
  user: 'admin',
  password: 'hgNFzhQ1frChitO0BS51MM0Ripaf7PGx',
  database: 'share_analytics',
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
