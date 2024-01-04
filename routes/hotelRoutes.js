const route = require("express").Router();
const {
  createHotel,
  hotelVideoStream,
  getHotelsReelData,
  getHotelsFilters
} = require("../controller/hotelController");
const validateUser = require("../middleware/auth");
const { multipleUpload } = require("../middleware/multer");

route.post(
  "/hotel/register",
  validateUser,
  multipleUpload,
  createHotel
);
route.post("/hotel/video/stream", hotelVideoStream);
route.get("/hotel/reel/video", getHotelsReelData);
route.get("/hotel/filters", getHotelsFilters);

module.exports = route;
