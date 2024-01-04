const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Ensure to configure the connection in this file

const User = sequelize.define("User", {
  principal: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  privateToken: {
    type: DataTypes.STRING,
  },
  userType: {
    type: DataTypes.STRING,
  },
  publicToken: {
    type: DataTypes.STRING,
  },
});
module.exports = { User };
