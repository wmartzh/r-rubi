const Joi = require("joi");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");
const prisma = new PrismaClient();
const { TokenGenerator, genKey } = require("../helpers/authHelper");
const register = async (req, res) => {
  try {
    // validate data
    const registerSchema = Joi.object({
      username: Joi.string().alphanum().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      passwordConfirm: Joi.ref("password"),
    });
    // validate body request
    const data = await registerSchema.validateAsync(req.body);
    // hash pass
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    //store data
    await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hash,
        rememberToken: "",
      },
    });
    res.status(201).json({
      message: "User was created successfully",
    });
  } catch (error) {
    console.log("🚀 -> register -> error", error.code);
    if (error.details) {
      res.status(400).json(error);
    } else if (error.code && error.code === "P2002") {
      res.status(400).json({
        detail: "email is already taken",
      });
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};

const login = async (req, res) => {
  try {
    // Validate Data
    const loginSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .required(),
      password: Joi.string().required(),
    });
    const data = await loginSchema.validateAsync(req.body);

    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: data.email,
        },
      },
    });
    // check if user exists
    if (user == null) {
      res.status(404).json({
        error: "User email doesn't exists",
      });
      return;
    }
    // match passowd
    let matchPassword = await bcrypt.compare(data.password, user.password);

    if (matchPassword) {
      const tk = new TokenGenerator({
        email: user.email,
        userId: user.id,
        role: user.role,
        password: user.password,
      });

      res.json({
        user: user.username,
        message: "User was logged successfully",
        access_token: tk.getAccessToken(),
        refresh_token: tk.getRefreshToken(),
      });
    } else {
      res.status(404).json({
        error: "Password doesn't match",
      });
    }
  } catch (error) {
    console.log("🚀 -> login -> error", error);
    if (error.details) {
      res.status(400).json(error);
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};
const refreshToken = async (req, res) => {
  const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  try {
    const data = await refreshTokenSchema.validateAsync(req.body);
    console.log("🚀 -> refreshToken -> data", data);
    const payload = jwt.verify(data.refreshToken, process.env.PRIVATE_KEY);
    if (payload.type !== "refresh") {
      throw { code: 400, message: "Wrong token type provided" };
    }
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: data.userId,
        },
      },
    });
    const key = genKey(user.id, user.password);
    if (key != payload.key) {
      throw { code: 400, message: "Unauthorized, password wasChanged" };
    }

    const tk = new TokenGenerator({
      email: user.email,
      userId: user.id,
      role: user.role,
      password: user.password,
    });

    res.json({ access_token: tk.getAccessToken() });
  } catch (error) {
    console.log("🚀 -> refreshToken -> error", error);

    if (error.code) {
      res.status(error.code).json(error.message);
    } else if (error.details) {
      res.status(400).json(error);
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};
module.exports = {
  register,
  login,
  refreshToken,
};
