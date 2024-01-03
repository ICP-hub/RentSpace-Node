const { Hotels } = require("../models/Hotel");
const errorMessages = require("../config/errorMessages.json");
const successMessages = require("../config/successMessages.json");
const fs = require("fs");
const { hotel } = require("../motoko/hotel/index.js");
const { deleteFile } = require("../helper/deleteFile");

module.exports = {
  async createHotel(req, res) {
    try {
      const { hotelTitle, hotelDes, hotelPrice, hotelLocation } = req.body;
      if (
        _.isEmpty(hotelTitle) ||
        _.isEmpty(hotelDes) ||
        _.isEmpty(hotelPrice) ||
        _.isEmpty(hotelLocation)
      ) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }
      const createdAt = "";

      const hotelImagePath = [];
      let hotelImage = req.files.images;
      let hotelVideoPath = req.files.videos[0].path;

      for (const image of hotelImage) {
        hotelImagePath.push(image.path);
      }
      if (!req.files) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.noFileUploaded });
      }

      const hotelData = {
        hotelTitle: hotelTitle,
        hotelDes: hotelDes,
        hotelImage: hotelImagePath.toString(),
        hotelPrice: hotelPrice,
        hotelLocation: hotelLocation,
        createdAt: createdAt,
      };
      const hotelId = await hotel.createHotel(hotelData);
      await Hotels.create({
        hotelId: hotelId,
        hotelImagePath: hotelImagePath,
        hotelVideoPath: hotelVideoPath,
        hotelLocation: hotelLocation,
      });

      return res
        .status(201)
        .json({ staus: true, message: successMessages.hotelCreated });
    } catch (error) {
      console.log("Error", error.message);
      deleteFile(req.files);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  hotelVideoStream(req, res) {
    try {
      const hotelId = req.body.hotelId;

      const range = req.headers.range;
      if (!range) {
        res
          .status(400)
          .json({ status: false, error: errorMessages.rangeRequired });
      }

      const hotelData = Hotels.findOne({ hotelId });
      if (!hotelData) {
        return res
          .status(404)
          .json({ status: false, error: errorMessages.notFound });
      }

      const videoSize = fs.statSync(hotelData.videoPath).size;

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
      return res
        .status(500)
        .json({ status: false, message: errorMessages.internalServerError });
    }
  },
};
