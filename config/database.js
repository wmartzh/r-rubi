const { Pool, Client } = require("pg");
const config = {
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
};
const pool = new Pool(config);

const query = async (query, values) => {
  const client = await pool.connect();
  let res;
  try {
    await client.query("BEGIN");
    try {
      res = await client.query(query, values);
      await client.query("COMMIT");
    } catch (err) {
      console.log("🚀 ~ file: database.js ~ line 20 ~ query ~ err", err);
      await client.query("ROLLBACK");
      throw err;
    }
  } finally {
    client.release();
  }
  return res;
};

module.exports = {
  query,
};
