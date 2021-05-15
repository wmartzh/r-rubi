const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(err);
  } else if (res) {
    console.log("Database was connected succesfully");
  }
  pool.end();
});
const client = new Client({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
});

module.exports = client;
