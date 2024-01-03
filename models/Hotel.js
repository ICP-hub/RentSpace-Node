const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Ensure to configure the connection in this file

const Hotels = sequelize.define("Hotel", {
  hotelId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  hotelImagePath: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  hotelVideoPath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hotelLocation: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = { Hotels };