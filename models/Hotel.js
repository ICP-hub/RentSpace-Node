const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Ensure to configure the connection in this file

const Hotels = sequelize.define("Hotel", {
  hotelId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  userPrincipal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagesUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  videoUrls: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
module.exports = { Hotels };
