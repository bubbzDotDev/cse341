const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'cse341',
  password: 'password',
  port: 3307
});

module.exports = pool.promise();