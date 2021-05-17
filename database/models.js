const database = require("../config/database");
const { DataTypes, Model } = require("sequelize");
const { DateTime } = require("luxon");

const now = DateTime.now().toISO();

//Roles
const Role = database.define("roles", {
  name: {
    type: DataTypes.STRING,
  },
});

//Users
const User = database.define("users", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  roleId: {
    type: DataTypes.INTEGER,
  },
});

//RELATIONSHIPS

// Role - user relationship
User.belongsTo(Role, { foreignKey: { name: "roleId" } });
// Role.belongsTo(User);

module.exports = {
  User,
  Role,
};
