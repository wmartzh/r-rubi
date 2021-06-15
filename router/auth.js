const router = require("express").Router();
const authController = require("../controllers/authController");

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

module.exports = router;
