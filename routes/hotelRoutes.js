const route = require("express").Router();
const {
  createHotel,
  hotelVideoStream,
  getHotelsReelData,
  getHotelsFilters,
  updateLikesOnHotel,
  getLikesOnHotel,
  deleteHotel,
  updateHotel,
  updateHotelAvailbility,
  searchHotel,
  getHotelInfo,
  bookHotel,
  getAllHotels
} = require("../controller/hotelController");
const validateUser = require("../middleware/auth");
const { verifyDelegation } = require("../middleware/authICPDelegation");
const { createHotelActor } = require("../middleware/createHotelActor");
const { multipleUpload } = require("../middleware/multer");

// route.post(
//   "/hotel/register",
//   verifyDelegation,
//   createHotelActor,
//   multipleUpload,
//   createHotel
// );
route.post("/hotel/register",createHotel);

route.post("/hotel/video/stream", hotelVideoStream);
route.get("/hotel/reel/video", getHotelsReelData);
route.get("/hotel/filters", getHotelsFilters);
route.patch("/updateLikesOnHotel", updateLikesOnHotel);
route.get("/hotel/getLikes", getLikesOnHotel);
route.delete("/hotel/deleteHotel", deleteHotel);
route.put("/hotel/updateHotel", updateHotel);
route.put("/hotel/updateHotelAvailbility", updateHotelAvailbility);
route.get("/hotel/getAllHotels", getAllHotels);

// ratehawk api

route.post("/hotel/RateHawk/searchHotel", searchHotel ); 
route.post("/hotel/RateHawk/getHotelInfo", getHotelInfo ); 
route.post("/hotel/RateHawk/bookHotel", bookHotel ); 


module.exports = route;
