const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '0.tcp.ngrok.io',
  port: '11656',
  user: 'annie',
  password: '1234',
  database: 'share_analytics'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

module.exports = connection;
