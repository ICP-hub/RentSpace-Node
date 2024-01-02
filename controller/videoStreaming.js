const { Hotels } = require("../models/hotel");
module.exports = {
  videoStream(req, res) {
    try {
      const hotelId = req.body.hotelId;

      const range = req.headers.range;
      if (!range) {
        res.status(400).send("Required Range headers");
      }

      const hotelData = Hotels.findOne({ hotelId });
      console.log(hotelData);
      if (!hotelData) {
        return res.status(404).send("Hotel not found");
      }

      const videoSize = fs.statSync(videoPath).size;

      const CHUNK_SIZE = 10 ** 6; //1 mb
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "new.mp4",
      };
      res.writeHead(206, headers);
      const videoStream = fs.createReadStream(videoPath, { start, end });
      videoStream.pipe(res);
    } catch (error) {
      res.status(500).json({ status: false, message: "error" });
    }
  },
};
