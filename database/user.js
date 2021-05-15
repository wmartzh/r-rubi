const database = require("../config/database");
const { DateTime } = require("luxon");

const now = DateTime.now().toISO();

const createUser = async ({ username, email, password }) => {
  let query = `INSERT INTO users(username,email,password,roleId,updatedAt) 
    VALUES($1, $2, $3, $4, $5)`;
  database.connect();

  try {
    let result = await database.query(query, [
      username,
      email,
      password,
      3,
      now,
    ]);
    console.log(result);
    return result
  } catch (error) {
    // console.log("🚀 ~ file: user.js ~ line 22 ~ createUser ~ error", error)
    throw error;
  }
};

module.exports = {
  createUser,
};
