const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const Property = sequelize.define("Property", {
  propertyId: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  propertyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  propertyDescription: {
    type: DataTypes.TEXT,
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
    defaultValue: "USDT",
  },
  imageList: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  videoList: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  maxOccupancy: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  rooms: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: [],
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
  amenities: {
    type: DataTypes.ARRAY(
      DataTypes.ENUM(
        "wifi",
        "gym",
        "tv",
        "laundry",
        "parking",
        "medication",
        "gaming",
        "dining",
        "ac"
      )
    ),
    defaultValue: [],
  },
  propertyType: {
    type: DataTypes.ENUM(
      "House",
      "Villa",
      "Apartment",
      "Hotel",
      "Resort",
      "Glamping"
    ),
    defaultValue: "Hotel",
  },
  paymentMethods: {
    type: DataTypes.ARRAY(
      DataTypes.ENUM(
        "ICP",
        "SOL",
        "ckBTC",
        "ckEth",
        "gPay",
        "applePay",
        "creditCard"
      )
    ),
    defaultValue: ["ICP", "creditCard"],
  },
  phantomWalletID: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  availableFrom: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  availableTill: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

module.exports = { Property };
