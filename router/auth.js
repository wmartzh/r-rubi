const router = require("express").Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
/**
 * @swagger
 * /auth/register:
 *  post:
 *   summary: Register a new user
 *      responses:
 *          200:
 *              description: User created
 *
 *
 *
 *
 */
router.post("/register", authController.register);
router.post("/login", authController.login);

// router.use(authMiddleware.auth);
router.post("/refreshToken", authController.refreshToken);

module.exports = router;
