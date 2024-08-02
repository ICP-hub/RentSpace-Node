const {createBooking,updateBooking} = require("../controller/checkOutController");

const route = require("express").Router();

route.post("/booking/create",createBooking);
// route.post("/booking/update",updateBooking);

module.exports = route;