const express = require("express");
const { videoStream } = require("../controller/videoStreaming");
const route = express.Router();

route.post("/video", videoStream);

module.exports = route;

