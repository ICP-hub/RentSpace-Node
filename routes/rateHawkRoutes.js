const route = require("express").Router();

const {searchHotel,getHotelInfo,bookHotel} = require("../controller/rateHawkController");


// ratehawk api

// route.post("/hotel/RateHawk/searchHotel", searchHotel ); 
route.post("/hotel/RateHawk/getHotelInfo", getHotelInfo ); 
route.post("/hotel/RateHawk/bookHotel", bookHotel ); 


module.exports = route;


