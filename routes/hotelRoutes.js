const route = require("express").Router();
const {
  createHotel,
  hotelVideoStream,
  getHotelsReelData,
  getHotelsFilters,
  updateLikesOnHotel,
  getLikesOnHotel,
  deleteHotel,
  updateHotel
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

module.exports = route;
