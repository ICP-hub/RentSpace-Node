const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Message = sequelize.define("Message", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  fromPrincipal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  toPrincipal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iv: {
    type: DataTypes.BLOB,
    allowNull: false
  }
});

module.exports = { Message };
