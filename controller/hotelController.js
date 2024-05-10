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
const axios = require("axios");
const { create } = require("underscore");

const RateHawkUrls = require("../config/rateHawkUrls");

const username = process.env.RATE_HAWK_USERNAME;
const password = process.env.RATE_HAWK_PASSWORD;

module.exports = {
  // create hotel
  async createHotel(req, res) {
    try {
      const principal = req.principal;
      const {
        hotelTitle,
        hotelDes,
        hotelPrice,
        priceCurrency,
        hotelLocation,
        imagesUrls,
        videoUrls,
        latitude,
        longitude,
        amenities,
        propertyType,
        paymentMethods,
        phantomWalletID,
        vidFiles,
        imgFiles
      } = req.body;

      console.log("req.files", req.body);
      // console.log("req.body.files", JSON.parse(req.body.files));
      // console.log("req.body.files[0]",req.body?.files?.[0])

      if (
        _.isEmpty(hotelTitle) ||
        _.isEmpty(hotelDes) ||
        _.isEmpty(hotelPrice) ||
        _.isEmpty(hotelLocation) ||
        _.isEmpty(latitude) ||
        _.isEmpty(longitude)
      ) {
        console.log("empty")
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      // if (hotelDes.length > 700 || hotelTitle.length > 70) {
      //   return res
      //     .status(400)
      //     .json({ status: false, error: errorMessages.dataTooLarge });
      // }

      let user = await User.findOne({ where: { principal: principal } });
      if (_.isEmpty(user)) {
        return res
          .status(404)
          .json({ status: false, error: errorMessages.userNotFound });
      }

      // if (_.isEmpty(req.files) && _.isEmpty(req.body.files)) {
      //   return res
      //     .status(400)
      //     .json({ status: false, error: errorMessages.noFileUploaded });
      // }

      // const createdAt = "";
      // const hotelImagePath = [];
      // let hotelVideoPath = [];

      // // This code for react native calls
      // if (_.isEmpty(req?.files?.[0]?.mimetype)) {
      //   // Check if the file size is within the allowed limits
      //   for (let file of JSON.parse(req.body.files)) {
      //     console.log("files : ", file);
      //     if (file.type.includes("video")) {
      //       if (!file || file.fileSize > 200 * 1024 * 1024) {
      //         // 200MB limit of video size
      //         return res
      //           .status(400)
      //           .json({ status: false, error: errorMessages.fileSizeTooLarge });
      //       }
      //     }
      //     if (!file || file.fileSize > 20 * 1024 * 1024) {
      //       // 20MB limit of image size
      //       return res
      //         .status(400)
      //         .json({ status: false, error: errorMessages.fileSizeTooLarge });
      //     }
      //   }

      //   let hotelFiles = JSON.parse(req.body.files); // Corrected variable name
      //   for (const file of hotelFiles) {
      //     let imageUrl = await uploadFileToGCS(
      //       appConstant.BUCKET_NAME,
      //       file.fileName, // Corrected property name
      //       file.type, // Corrected property name
      //       file.base64,
      //       null,
      //       req.body
      //     );
      //     if (file.type.includes("video")) {
      //       // Corrected property name
      //       hotelVideoPath.push(imageUrl);
      //     } else {
      //       hotelImagePath.push(imageUrl);
      //     }
      //   }
      //   console.log("uploaded videos : ", hotelVideoPath);
      //   console.log("uploaded images : ", hotelImagePath);
      // }

      // // This code for web browsers or postman
      // if (_.isEmpty(req?.files?.[0]?.type)) {
      //   // Check if the file size is within the allowed limitx
      //   for (let file of req.files) {
      //     if (file.mimetype.includes("video")) {
      //       if (!file || file.size > 200 * 1024 * 1024) {
      //         // 200MB limit of video size
      //         return res
      //           .status(400)
      //           .json({ status: false, error: errorMessages.fileSizeTooLarge });
      //       }
      //     }
      //     if (!file || file.size > 20 * 1024 * 1024) {
      //       // 20MB limit of image size
      //       return res
      //         .status(400)
      //         .json({ status: false, error: errorMessages.fileSizeTooLarge });
      //     }
      //   }
      //   let hotelFiles = req.files;

      //   for (const file of hotelFiles) {
      //     let imageUrl = await uploadFileToGCS(
      //       appConstant.BUCKET_NAME,
      //       file.originalname,
      //       file.mimetype,
      //       null,
      //       file
      //     );
      //     if (file.mimetype.includes("video")) {
      //       hotelVideoPath.push(imageUrl);
      //     } else {
      //       hotelImagePath.push(imageUrl);
      //     }
      //   }
      // }

      
      const requestedAmenities = amenities.split(",");
      const acceptedPaymentMethods = paymentMethods.split(",");
      const newImgFiles=imgFiles.split(',')
      const newVidFiles=vidFiles.split(',')

      const currentDate = new Date();

      const day = currentDate.getDate(); // Get the day of the month (1-31)
      const month = currentDate.getMonth() + 1; // Get the month (0-11) + 1 because months are zero-based
      const year = currentDate.getFullYear();

      // Convert oneMonthAfter to a date object
      const oneMonthAfterDate = new Date(`${month + 1}/${day}/${year}`);

      console.log("date : ", currentDate);
      console.log("oneMonthAfter : ", oneMonthAfterDate);
      

      await Hotels.create({
        hotelId: hotelId, // need to generate unique id for each hotel
        hotelName: hotelTitle,
        hotelDescription: hotelDes,
        userPrincipal: principal,
        userPrincipal: "2yv67-vdt7m-6ajix-goswt-coftj-5d2db-he4fl-t5knf-qii2a-3pajs-cqe", // get it from frontend this is hardcoded for now for testing
        price: hotelPrice,
        priceCurrency: priceCurrency ? priceCurrency : "USDT", // get it from frontend this is hardcoded for now for testing
        imagesUrls: imagesUrls ? imagesUrls : "https://firebasestorage.googleapis.com/v0/b/rentspace-e58b7.appspot.com/o/hotelImage%2FFreeVector-Seaside-Hotel-Vector.jpg?alt=media&token=ba2925c4-a339-4789-b1c8-eefff2bba27f",
        videoUrls: videoUrls ? videoUrls : "https://firebasestorage.googleapis.com/v0/b/rentspace-e58b7.appspot.com/o/hotelVideo%2FWhite%20Brown%20Modern%20Minimalist%20Real%20Estate%20Open%20House%20Video.mp4?alt=media&token=2ea7cc7c-0790-4f85-bfc8-4745662f4d8f", // get it from frontend
        location: hotelLocation,
        latitude: latitude,
        longitude: longitude,
        likedBy: [], // list of user principal who liked the hotel, by default it is empty on creation
        amenities: amenities,
        propertyType: propertyType,
        paymentMethods: acceptedPaymentMethods,
        phantomWalletID: phantomWalletID,
        availableFrom: oneMonthAfterDate,
        availableTill: oneMonthAfterDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return res
        .status(201)
        .json({ staus: true, message: successMessages.hotelCreated });
    } catch (error) {
      console.log("Error -> ", error);
      // deleteFileFromLocal(req.files);
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
        amenities,
        propertyType,
      } = req.query;

      // Define conditions for filtering
      const conditions = {};

      // get current date in format yyyy-mm-dd to match with availableFrom and availableTill
      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var final = `${year}-${month}-${day + 1}`;
      var currentDate = new Date(final);

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
      if (propertyType) {
        conditions.propertyType = propertyType;
      }
      if (amenities && amenities.length > 0) {
        const requestedAmenities = amenities.split(",");
        console.log("req amen : ", requestedAmenities);
        conditions.amenities = {
          [Op.overlap]: [...requestedAmenities],
        };
      }
      // check if availableFrom is less than or equal to current date and availableTill is greater than or equal to current date
      if (currentDate) {
        conditions.availableFrom = {
          [Op.lte]: currentDate,
        };
        conditions.availableTill = {
          [Op.gte]: currentDate,
        };
      }

      // Calculate offset based on pagination parameters
      const offset = (page - 1) * pageSize;

      // Query the database with the defined conditions
      const filteredHotelsDB = await Hotels.findAll({
        where: conditions,
        limit: pageSize,
        offset: offset,
      });

      // let response
      // const options = {
      //   method: 'GET',
      //   url: 'https://booking-com13.p.rapidapi.com/stays/properties/list-v2',
      //   params: {
      //     location: 'France',
      //     checkin_date: '2024-02-09',
      //     checkout_date: '2024-02-10',
      //     language_code: 'en-us',
      //     currency_code: 'USD'
      //   },
      //   headers: {
      //     'X-RapidAPI-Key': '4c950a4ca5msh959e74b886a4c78p1c992bjsnd97091aca10c',
      //     'X-RapidAPI-Host': 'booking-com13.p.rapidapi.com'
      //   }
      // };

      // try {
      //   response = await axios.request(options);
      // } catch (error) {
      //   console.error(error);
      // }

      // const hotelsFromAPI = []
      // console.log(response)
      // const data = response.data?.data?.length

      // for (let i = 0; i < data; i++) {

      //   if (hotelsFromAPI && Array.isArray(hotelsFromAPI)) {
      //     hotelsFromAPI.push({
      //       idDetail: response.data?.data[i]?.idDetail,
      //       hotelName: response.data?.data[i]?.displayName?.text,
      //       location: response.data?.data[i]?.basicPropertyData.location?.address + ", " + response.data?.data[i]?.basicPropertyData.location?.city,
      //       price: response.data?.data[i]?.priceDisplayInfoIrene?.displayPrice?.amountPerStay?.amountRounded.replace("$", "").replace(",", ""),
      //       priceCurrency: response.data?.data[i]?.priceDisplayInfoIrene?.displayPrice?.amountPerStay?.currency
      //     })
      //   }

      // }

      // const filteredHotelsAPI = hotelsFromAPI.filter(item => {
      //   if (minPrice && minPrice != "" && !maxPrice) {

      //     return parseInt(item.price) >= parseInt(minPrice)
      //   } if (maxPrice && maxPrice != "" && !minPrice) {

      //     return parseInt(item.price) <= parseInt(maxPrice)
      //   } if (maxPrice && minPrice && maxPrice != "" && minPrice != "") {

      //     return parseInt(item.price) <= parseInt(maxPrice) && parseInt(item.price) >= parseInt(minPrice)
      //   } if (name && name != "" && !location) {
      //     return item.hotelName == name
      //   } if (location && location != "" && !name) {
      //     return item.location == location
      //   } if (name && location && name != "" && location != "") {
      //     return item.hotelName == name && item.location == location
      //   }
      // })

      if (filteredHotelsDB.length == 0) {
        return res.json({
          status: false,
          message: errorMessages.noDataFound,
        });
      }
      res.json({ status: true, hotels: filteredHotelsDB });
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

  async updateLikesOnHotel(req, res) {
    try {
      const { user, hotelId } = req.body;

      if (
        user == "" &&
        hotelId == "" &&
        user == undefined &&
        hotelId == undefined
      ) {
        return res
          .status(400)
          .json({ status: false, message: errorMessages.invalidData });
      }
      const hotelData = await Hotels.findOne({ where: { hotelId } });

      if (!hotelData) {
        return res
          .status(400)
          .json({ status: false, message: errorMessages.hotelNotFound });
      }

      if (hotelData?.likedBy?.length != 0) {
        if (hotelData?.likedBy?.includes(user)) {
          const newArr = hotelData?.likedBy?.filter((item) => item != user);
          const update = await hotelData.update({ likedBy: newArr });
          return res.status(200).json({
            status: true,
            likedremovedBy: user,
            message: successMessages.removeLike,
          });
        } else {
          const arr = [...hotelData?.likedBy, user];
          const update = await hotelData.update({ likedBy: arr });
          return res.status(200).json({
            status: true,
            likedBy: user,
            message: successMessages.likeSuccess,
          });
        }
      } else {
        const arr = [...hotelData?.likedBy, user];
        const update = await hotelData.update({ likedBy: arr });
        return res.status(200).json({
          status: true,
          likedBy: user,
          message: successMessages.likeSuccess,
        });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: false, message: errorMessages.internalServerError });
    }
  },

  async getLikesOnHotel(req, res) {
    const hotelId = req.query.hotelId;
    console.log(hotelId);

    const hotelData = await Hotels.findOne({ where: { hotelId } });

    if (!hotelData) {
      return res
        .status(400)
        .json({ status: false, message: errorMessages.hotelNotFound });
    }

    res.json({ status: true, numberOfLikes: hotelData.likedBy?.length });
  },

  // get all hotels

  async getAllHotels(req, res) {

    const userPrincipal = req.query.userPrincipal; // replace with user principal from frontend header like req.header("userPrincipal")

    try {
      const hotels = await Hotels.findAll({ where: { userPrincipal }});
      if (hotels.length == 0) {
        return res.json({
          status: false,
          message: errorMessages.noDataFound,
        });
      }
      res.json({ status: true, hotels: hotels });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  // delete hotel by hotelId

  async deleteHotel(req, res) {
    try {
      const hotelId = req.query.hotelId;
      console.log(hotelId);
      console.log(req.hotelCanister)

      // await req.hotelCanister.deleteHotel()

      const hotel = await Hotels.findOne({ where: { hotelId } });

      // if (!hotel) {
      //   return res
      //     .status(400)
      //     .json({ status: false, message: errorMessages.hotelNotFound });
      // }

      // await hotel.destroy();

      res.json({ status: true, message: successMessages.hotelDeleted });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }

    await hotel.destroy()
    .then(() => {
      console.log("Hotel deleted successfully");
    })

    res.json({ status: true, message: successMessages.hotelDeleted });
  },

  // update hotel by hotelId
  async updateHotel(req, res) {
    const {
      hotelId,
      hotelName,
      hotelDes,
      price,
      imagesUrls,
      videoUrls,
      location,
      amenities,
      propertyType,
      paymentMethods,
    } = req.body;

    const updateFields = {};

    if (hotelName) {
      updateFields.hotelName = hotelName;
    }
    if (hotelDes) {
      updateFields.hotelDescription = hotelDes;
    }
    if (price) {
      updateFields.price = price;
    }
    if (imagesUrls) {
      updateFields.imagesUrls = imagesUrls;
    }
    if (videoUrls) {
      updateFields.videoUrls = videoUrls;
    }
    if (location) {
      updateFields.location = location
    }
    if (amenities) {
      updateFields.amenities = amenities;
    }
    if (propertyType) {
      updateFields.propertyType = propertyType;
    }
    if (paymentMethods) {
      updateFields.paymentMethods = paymentMethods;
    }
    

    // Finding and updating the hotel in postgres
    const hotel = await Hotels.findOne({ where: { hotelId } });

    if (!hotel) {
      return res
        .status(400)
        .json({ status: false, message: errorMessages.hotelNotFound });
    }
    if (hotel) {
      await hotel.update({
        ...updateFields, updatedAt: new Date()
      });

      console.log("Hotel updated successfully");

      return res.json({ status: true, message: successMessages.hotelUpdated });
    }
  },

  async updateHotelAvailbility(req, res) {
    const { hotelId, availableFrom, availableTill } = req.body;

    // Finding and updating the hotel in postgres
    const hotel = await Hotels.findOne({ where: { hotelId } });

    if (!hotel) {
      return res
        .status(400)
        .json({ status: false, message: errorMessages.hotelNotFound });
    }
    if (hotel) {
      await hotel.update({
        updatedAt: new Date(),
        availableFrom: availableFrom,
        availableTill: availableTill,
      });

      console.log("Hotel availibility updated successfully");

      return res.json({ status: true, message: successMessages.hotelUpdated });
    }
  },

  // rate hawk api's for hotel

  // search hotel
  async searchHotel(req, res) {
    const { query, language } = req.body;

    const postData = {
      query: query,
      language: language,
    };

    await axios
      .post(RateHawkUrls.searchUrl,
        postData,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      )
      .then((response) => {
        console.log("Response sent");
        res.json({ status: true, data: response.data });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  },

  // get hotel info
  async getHotelInfo(req, res) {
    const { hotelId, language } = req.body;

    const postData = {
      id: hotelId,
      language: language,
    };

    await axios
      .post(RateHawkUrls.hotelInfoUrl,
        postData,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      )
      .then((response) => {
        console.log("Response sent");
        res.json({ status: true, data: response.data });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  },

  // book hotel - get booking hash
  async bookHotel(req, res) {
    const { hotelId, checkInDate, checkOutDate, adults, children } =
      req.body;

    const postData = {
      id: hotelId,
      checkin: checkInDate,
      checkout: checkOutDate,
      language: "en",
      guests: [
        {
          adults: adults,
          children: children,
        },
      ],
    };

    await axios
      .post(RateHawkUrls.hotelBookUrl,
        postData,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      )
      .then((response) => {
        console.log("Response sent");
        res.json({ status: true, data: response.data });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  },

};
