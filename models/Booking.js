const { DataTypes, ARRAY, ENUM } = require("sequelize");
const sequelize = require("../database"); 
const { emit } = require("nodemon");

// this file is made for ratehawk

const Bookings = sequelize.define("Booking", {

    // bookingID : {
    //     type: DataTypes.STRING,
    //     primaryKey: true,
    // },
    
    userId : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    propertyID : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    propertyName : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    propertyLocation : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    checkInDate : {
        type: DataTypes.DATE,
        allowNull: false,
    },

    checkOutDate : {
        type: DataTypes.DATE,
        allowNull: false,
    },

    bookingDate : {
        type: DataTypes.DATE,
        allowNull: false,
    },

    guestDetails : {
        type: ARRAY(DataTypes.JSONB),
        defaultValue: [],
    },

    bookingStatus : {
        type: ENUM('Pending', 'Confirmed', 'Cancelled'),
        defaultValue: 'Pending',
    },

    paymentStatus : {
        type: ENUM('Pending', 'Paid'),
        defaultValue: 'Pending',
    },

    email : {
        type: DataTypes.STRING,
        allowNull: false,
    },

    phone : {
        type: DataTypes.STRING,
        allowNull: false,
    },


});

module.exports = {Bookings};