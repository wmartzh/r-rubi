const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const config = {
  dialect: "postgres",
  username: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
};

const sequelize = new Sequelize(config);
const db = {};
const models = path.join(__dirname, "database"); // path to a models' folder

fs.readdirSync(models)
  .filter(function (file) {
    return file.indexOf(".") !== 0 && file.slice(-3) === ".js";
  })
  .forEach(function (file) {
    var model = sequelize["import"](path.join(models, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
module.exports = sequelize;
