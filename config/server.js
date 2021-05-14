require("dotenv").config({ path: "./.env" });
const express = require("express");
const database = require("./database.js");
const router = require("../router");
const app = express();

const port = process.env.SERVER_PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    name: "CoolAPI",
    description: "API for a cool app",
    version: "1.0.0",
  });
});
app.use(router);

app.listen(port, () => {
  console.log(`App listening at 127.0.0.1:${port}`);
});
