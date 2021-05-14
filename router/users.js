const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("this is a test from group");
});

module.exports = router;
