const route = require("express").Router();

const {
  // getHotelInfo,
  bookHotel,
  checkhash,
//   ---------------------
  orderBookingForm,
  crediCardTokenization,
  orderBookFinish,
  orderBookFinishStatus,

  // ---------------------
  // searchRatehawkHotels,
} = require("../controller/rateHawkController");

// ratehawk api

// route.post("/hotel/RateHawk/searchHotel", searchHotel );
// route.post("/hotel/RateHawk/getHotelInfo", getHotelInfo);
route.post("/hotel/RateHawk/bookHotel", bookHotel);
route.post("/hotel/RateHawk/checkhash", checkhash);
route.post("/hotel/RateHawk/orderBookingForm", orderBookingForm);
route.post("/hotel/RateHawk/crediCardTokenization", crediCardTokenization);
route.post("/hotel/RateHawk/orderBookFinish", orderBookFinish);
route.post("/hotel/RateHawk/orderBookFinishStatus", orderBookFinishStatus);
// route.post("/hotel/RateHawk/searchRatehawkHotels", searchRatehawkHotels);

module.exports = route;
