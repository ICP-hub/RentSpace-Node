const route = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const {
  createHotel,
  hotelVideoStream,
} = require("../controller/hotelController");

route.post(
  "/hotel/register",
  upload.fields([{ name: "images" }, { name: "videos", maxCount: 1 }]),
  createHotel
);
route.post("/hotel/video/stream", hotelVideoStream);

module.exports = route;
