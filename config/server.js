require("dotenv").config({ path: "./.env" });
const express = require("express");

const router = require("../router");
const app = express();
const cors = require("cors");
const port = process.env.SERVER_PORT || 3000;

const logger = (req, res, next) => {
  // console.log("🚀 -> logger -> res", res);
  res.on("finish", () => {
    console.log(
      `${req.method} ${req.hostname}${req.url} [status:${res.statusCode}]'`
    );
  });
  next();
};
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cors());
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
  console.log(`App listening at 127.0.0.1:${port}`);
});
