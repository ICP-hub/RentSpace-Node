const route = require("express").Router();

const {
  getHotelInfo,
  bookHotel,
  checkhash,
  orderBookingForm,
  crediCardTokenization,
  orderBookFinish,
} = require("../controller/rateHawkController");

// ratehawk api

// route.post("/hotel/RateHawk/searchHotel", searchHotel );
route.post("/hotel/RateHawk/getHotelInfo", getHotelInfo);
route.post("/hotel/RateHawk/bookHotel", bookHotel);
route.post("/hotel/RateHawk/checkhash", checkhash);
route.post("/hotel/RateHawk/orderBookingForm", orderBookingForm);
route.post("/hotel/RateHawk/crediCardTokenization", crediCardTokenization);
route.post("/hotel/RateHawk/orderBookFinish", orderBookFinish);

module.exports = route;
