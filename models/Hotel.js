const { DataTypes, ARRAY } = require("sequelize");
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
  likedBy: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  amenities:{
    type:DataTypes.ARRAY(DataTypes.ENUM(
      "wifi",
      "gym",
      "tv",
      "laundry",
      "parking",
      "medication",
      "gaming",
      "dining"
    )),
    defaultValue:[],
  },
  propertyType:{
    type:DataTypes.ENUM(
      "House",
      "Guest House",
      "Flat",
      "Hotel",
      "Resort",
      "Palace"
    )
  },
  defaultValue:"Hotel"
});
module.exports = { Hotels };
