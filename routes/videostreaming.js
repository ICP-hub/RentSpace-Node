const { videoStream } = require("../controller/videoStreaming");
const { route } = require("./imageRoutes");

route.get("video/",videoStream);