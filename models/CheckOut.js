const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const CheckOut = sequelize.define("CheckOut", {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  propertyId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rommId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bookedRooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  checkIn: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  checkOut: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = { CheckOut };
