const { DataTypes } = require("sequelize");
const sequelize = require("../database"); // Ensure to configure the connection in this file

const Hotels = sequelize.define("Hotel", {
  hotelId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  hotelName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPrincipal: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  priceCurrency: {
    type: DataTypes.ENUM("USDT", "ICP", "ckBTC", "INR", "ETH"),
    allowNull: false,
    defaultValue: "ICP",
  },
  imagesUrls: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue("imagesUrls"));
    },
    set: function (value) {
      return this.setDataValue("imagesUrls", JSON.stringify(value));
    },
  },
  videoUrls: {
    type: DataTypes.TEXT,
    get: function () {
      return JSON.parse(this.getDataValue("videoUrls"));
    },
    set: function (value) {
      return this.setDataValue("videoUrls", JSON.stringify(value));
    },
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
module.exports = { Hotels };
