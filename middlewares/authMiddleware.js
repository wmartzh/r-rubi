const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
  try {
    let authHeader = req.headers["authorization"];
    if (authHeader === null || authHeader === undefined)
      throw { code: 400, message: "Authentication token is required" };

    let tk = authHeader.split(" ")[1];

    let decoded = await jwt.verify(tk, process.env.PRIVATE_KEY);

    let user = await prisma.user.findFirst({
      where: {
        email: {
          equals: decoded.email,
        },
      },
    });
    let exptk = new Date(decoded.exp);

    if (user == null) {
      throw { code: 401, message: "Unauthorized user" };
    } else {
      next();
    }
  } catch (error) {
    if (error.code) {
      res.status(error.code).json(error.message);
    } else if (error.TokenExpiredError) {
      res.status(400).json("Token provided is expired");
    } else {
      res.status(400).json("Token provided is invalid");
    }
  }
};

module.exports = {
  auth,
};
