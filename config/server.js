require("dotenv").config({ path: "./.env" });
const express = require("express");
const database = require("./database.js");
const router = require("../router");
const app = express();
const migrations = require("../database/migrations");
const port = process.env.SERVER_PORT || 3000;

const logger = (req, res, next) => {
  console.info(`${req.method} ${req.hostname}  ${req.url}`);
  next();
};
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(logger);
app.get("/v1", (req, res) => {
  res.json({
    name: "CoolAPI",
    description: "API for a cool app",
    version: "1.0.0",
  });
});
app.use("/v1", router);
// migrations.migrate();
app.listen(port, () => {
  database
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });

  console.log(`App listening at 127.0.0.1:${port}`);
});
