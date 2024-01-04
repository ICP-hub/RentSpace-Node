const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Ensure to configure the connection in this file

const History = sequelize.define('History', {
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
});

module.exports = History;