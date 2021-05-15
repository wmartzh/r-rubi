const Joi = require("joi");
const bcrypt = require("bcrypt");
const userDatabase = require("../database/user");

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

    // hash pass
    const data = await registerSchema.validateAsync(req.body);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.password, salt);

    //store data
    let result = await userDatabase.createUser({
      username: data.username,
      email: data.email,
      password: hash,
    });
    console.log(
      "🚀 ~ file: authController.js ~ line 30 ~ register ~ result",
      result
    );

    if (result) {
      res.status(201).json({
        message: "User was created successfully",
      });
    }
  } catch (error) {
    if (error.details) {
      res.status(400).json(error);
    } else if (error.code && error.code === "23505") {
      res.status(400).json({
        detail: "email its already taken",
      });
    } else {
      res.status(500).json({
        ServerError: error,
      });
    }
  }
};

module.exports = {
  register,
};
