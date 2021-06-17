const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const genKey = (id, password) => {
  const raw = id + password;
  return crypto
    .createHmac("sha256", process.env.PRIVATE_KEY)
    .update(raw)
    .digest("hex");
};

class TokenGenerator {
  constructor(params) {
    try {
      const { email, userId, role, password } = params;
      if (!email) {
        throw "email is required";
      } else if (!userId) {
        throw "UserId is required";
      } else if (!role) {
        throw "Role is required";
      }
      this.email = email;
      this.userId = userId;
      this.role = role;
      this.password = password;
    } catch (error) {
      throw new Error(error);
    }
  }
  getAccessToken() {
    const payload = {
      email: this.email,
      userId: this.userId,
      role: this.role,
      type: "access",
    };
    const accessToken = jwt.sign(payload, process.env.PRIVATE_KEY, {
      expiresIn: process.env.TOKEN_EXPIRES,
    });

    return accessToken;
  }
  getRefreshToken() {
    const key = genKey(this.userId, this.password);
    const payload = {
      email: this.email,
      userId: this.userId,
      role: this.role,
      type: "refresh",
      key: key,
      password: this.password,
    };
    const accessToken = jwt.sign(payload, process.env.PRIVATE_KEY);

    return accessToken;
  }
}
module.exports = {
  TokenGenerator,
  genKey,
};
