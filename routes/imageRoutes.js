const route = require("express").Router();
const { upload } = require("../middleware/uploadImage");
const { createHotel } = require("../controller/imageController");

route.post("/upload/images", upload.any(), createHotel);
module.exports = route;
