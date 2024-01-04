const { Hotels } = require("../models/Hotel");
const errorMessages = require("../config/errorMessages.json");
const successMessages = require("../config/successMessages.json");
const fs = require("fs");
const { v4 } = require("uuid");
const appConstant = require("../config/appConstant.json");
// const { hotel } = require("../motoko/hotel/index.js");
const { deleteFile } = require("../helper/deleteFile");
const { uploadFileToGCS } = require("../utils/googleCloudUpload");

module.exports = {
  async createHotel(req, res) {
    try {
      const { principal } = req.user;
      const {
        hotelTitle,
        hotelDes,
        hotelPrice,
        hotelLocation,
        latitude,
        longitude,
      } = req.body;
      if (
        _.isEmpty(hotelTitle) ||
        _.isEmpty(hotelDes) ||
        _.isEmpty(hotelPrice) ||
        _.isEmpty(hotelLocation) ||
        _.isEmpty(latitude) ||
        _.isEmpty(longitude)
      ) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      if (!req.files) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.noFileUploaded });
      }

      const createdAt = "";

      const hotelImagePath = [];
      let hotelVideoPath = [];
      let hotelImage = req.files;

      for (const image of hotelImage) {
        let imageUrl = await uploadFileToGCS(
          appConstant.BUCKET_NAME,
          image.path,
          image.originalname,
          image.mimetype
        );
        if (image.mimetype.includes("video")) {
          hotelVideoPath.push(imageUrl);
        } else {
          hotelImagePath.push(imageUrl);
        }
      }

      const hotelData = {
        hotelTitle: hotelTitle,
        hotelDes: hotelDes,
        hotelImage: hotelImagePath.toString(),
        hotelPrice: hotelPrice.toString(),
        hotelLocation: hotelLocation,
        createdAt: createdAt,
      };
      const hotelId = v4().toString();
      // const hotelId = await hotel.createHotel(hotelData);
      await Hotels.create({
        hotelId: hotelId,
        userPrincipal: principal,
        imagesUrls: hotelImagePath,
        videoUrls: hotelVideoPath,
        location: hotelLocation,
        latitude: latitude,
        longitude: longitude,
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

  async hotelVideoStream(req, res) {
    try {
      const hotelId = req.body.hotelId;

      const range = req.headers.range;
      if (!range) {
        res
          .status(400)
          .json({ status: false, error: errorMessages.rangeRequired });
      }

      const hotelData = await Hotels.findOne({ where: { hotelId } });
      if (!hotelData) {
        return res
          .status(404)
          .json({ status: false, error: errorMessages.notFound });
      }

      const videoSize = fs.statSync(hotelData.hotelVideoPath).size;

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
