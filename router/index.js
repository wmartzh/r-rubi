const router = require("express").Router();
const users = require("./users");
const auth = require("./auth");
const products = require("./products");

const authMiddleware = require("../middlewares/authMiddleware");
router.use("/auth", auth);

router.use(authMiddleware.auth);
router.use("/users", users);
router.use("/products", products);
router.use("/orders", users);

module.exports = router;
