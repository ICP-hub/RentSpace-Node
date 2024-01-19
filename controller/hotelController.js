const { Hotels } = require("../models/Hotel");
const errorMessages = require("../config/errorMessages.json");
const successMessages = require("../config/successMessages.json");
const fs = require("fs");
const { v4 } = require("uuid");
const appConstant = require("../config/appConstant.json");
const { uploadFileToGCS } = require("../utils/googleCloudUpload");
const { deleteFileFromLocal } = require("../utils/deleteFileFromLocal");
const { Op } = require("sequelize");
const { User } = require("../models/User");

module.exports = {
  async createHotel(req, res) {
    try {
      const principal = req.principal;
      const {
        hotelTitle,
        hotelDes,
        hotelPrice,
        hotelLocation,
        latitude,
        longitude,
      } = req.body;
      // console.log("req.files",req.body)
      console.log("req.body.files",JSON.parse(req.body.files))
      // console.log("req.body.files[0]",req.body?.files?.[0])
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

      if(hotelDes.length > 700 || hotelTitle.length > 70){
        return res.status(400).json({ status: false, error: errorMessages.dataTooLarge})
      }

      let user = await User.findOne({ where: { principal: principal } });
      if (_.isEmpty(user)) {
        return res
          .status(404)
          .json({ status: false, error: errorMessages.userNotFound });
      }

      if (_.isEmpty(req.files) && _.isEmpty(req.body.files)) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.noFileUploaded });
      }

      const createdAt = "";
      const hotelImagePath = [];
      let hotelVideoPath = [];

      // This code for react native calls
      if (_.isEmpty(req?.files?.[0]?.mimetype)) {
        // Check if the file size is within the allowed limits
        for (let file of JSON.parse(req.body.files)) {
          console.log("files : ",file)
          if (file.type.includes("video")) {
            if (!file || file.fileSize > 200 * 1024 * 1024) {
              // 200MB limit of video size
              return res
                .status(400)
                .json({ status: false, error: errorMessages.fileSizeTooLarge });
            }
          }
          if (!file || file.fileSize > 20 * 1024 * 1024) {
            // 20MB limit of image size
            return res
              .status(400)
              .json({ status: false, error: errorMessages.fileSizeTooLarge });
          }
        }

        let hotelFiles = JSON.parse(req.body.files); // Corrected variable name
        for (const file of hotelFiles) {
          let imageUrl = await uploadFileToGCS(
            appConstant.BUCKET_NAME,
            file.fileName, // Corrected property name
            file.type, // Corrected property name
            file.base64,
            null,
            req.body
          );
          if (file.type.includes("video")) {
            // Corrected property name
            hotelVideoPath.push(imageUrl);
          } else {
            hotelImagePath.push(imageUrl);
          }
        }
        console.log('uploaded videos : ',hotelVideoPath)
        console.log('uploaded images : ',hotelImagePath)
      }

      // This code for web browsers or postman
      if (_.isEmpty(req?.files?.[0]?.type)) {
        // Check if the file size is within the allowed limitx
        for (let file of req.files) {
          if (file.mimetype.includes("video")) {
            if (!file || file.size > 200 * 1024 * 1024) {
              // 200MB limit of video size
              return res
                .status(400)
                .json({ status: false, error: errorMessages.fileSizeTooLarge });
            }
          }
          if (!file || file.size > 20 * 1024 * 1024) {
            // 20MB limit of image size
            return res
              .status(400)
              .json({ status: false, error: errorMessages.fileSizeTooLarge });
          }
        }
        let hotelFiles = req.files;

        for (const file of hotelFiles) {
          let imageUrl = await uploadFileToGCS(
            appConstant.BUCKET_NAME,
            file.originalname,
            file.mimetype,
            null,
            file,
          );
          if (file.mimetype.includes("video")) {
            hotelVideoPath.push(imageUrl);
          } else {
            hotelImagePath.push(imageUrl);
          }
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

      console.log("hotelData : ", hotelData);
      // const hotelId = v4().toString();
      const hotelId = await req.hotelCanister.createHotel(hotelData);
      console.log("hotelId : ", hotelId);
      await Hotels.create({
        hotelId: hotelId,
        userPrincipal: principal,
        hotelName: hotelTitle,
        price: hotelPrice,
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
      deleteFileFromLocal(req.files);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getHotelsReelData(req, res) {
    try {
      const userLatitude = req.header("latitude");
      const userLongitude = req.header("longitude");
      let radius = req.header("radius");

      if (_.isEmpty(userLatitude) || _.isEmpty(userLongitude)) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      if (_.isEmpty(radius)) {
        radius = appConstant.RADIUS_IN_10_KM;
      }

      // Calculate the latitude and longitude boundaries
      const latBoundary =
        (Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI);
      const lonBoundary =
        ((Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI)) /
        Math.cos((userLatitude * Math.PI) / 180);

      // Find hotels within the specified 10 km radius
      const nearbyHotels = await Hotels.findAll({
        where: {
          latitude: {
            [Op.between]: [
              +userLatitude - latBoundary,
              +userLatitude + latBoundary,
            ],
          },
          longitude: {
            [Op.between]: [
              +userLongitude - lonBoundary,
              +userLongitude + lonBoundary,
            ],
          },
        },
      });

      if (nearbyHotels.length > 0) {
        // Return nearby hotels
        return res.status(200).json({ status: true, hotels: nearbyHotels });
      }
      // If no nearby hotels, return the latest uploaded hotel
      const latestHotels = await Hotels.findAll({
        order: [["createdAt", "DESC"]],
        limit: 10,
      });

      return res.status(200).json({ status: true, hotels: latestHotels });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getHotelsFilters(req, res) {
    try {
      const {
        name,
        location,
        minPrice,
        maxPrice,
        page = 1,
        pageSize = 10,
      } = req.query;

      // Define conditions for filtering
      const conditions = {};
      if (name) {
        conditions.hotelName = { [Op.iLike]: `%${name}%` }; // Case-insensitive partial match
      }
      if (location) {
        conditions.location = { [Op.iLike]: `%${location}%` }; // Case-insensitive partial match
      }
      if (minPrice || maxPrice) {
        conditions.price = {};
        if (minPrice) {
          conditions.price[Op.gte] = parseFloat(minPrice);
        }
        if (maxPrice) {
          conditions.price[Op.lte] = parseFloat(maxPrice);
        }
      }

      // Calculate offset based on pagination parameters
      const offset = (page - 1) * pageSize;

      // Query the database with the defined conditions
      const filteredHotels = await Hotels.findAll({
        where: conditions,
        limit: pageSize,
        offset,
      });

      res.json({ status: true, hotels: filteredHotels });
    } catch (error) {
      console.error(error);
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
