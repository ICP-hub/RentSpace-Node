const route = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const { createHotel } = require("../controller/imageController");

route.post(
  "/upload/images",
  upload.fields([{ name: "images" }, { name: "videos", maxCount: 1 }]),
  createHotel
);
module.exports = route;
