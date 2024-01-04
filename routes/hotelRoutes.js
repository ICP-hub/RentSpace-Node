const route = require("express").Router();
const {
  createHotel,
  hotelVideoStream,
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

module.exports = route;
