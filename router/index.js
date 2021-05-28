const router = require("express").Router();
const users = require("./users");
const auth = require("./auth");

const authMiddleware = require("../middlewares/authMiddleware");
router.use("/auth", auth);

router.use(authMiddleware.auth);
router.use("/users", users);

module.exports = router;
