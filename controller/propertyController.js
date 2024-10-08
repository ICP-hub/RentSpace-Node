const { Property } = require("../models/Property");
const errorMessages = require("../config/errorMessages.json");
const successMessages = require("../config/successMessages.json");
const appConstant = require("../config/appConstant.json");
const { Op } = require("sequelize");
const { isEmpty } = require("underscore");
const crypto = require("crypto");

const { searchHotel, searchRatehawkHotels } = require("./rateHawkController");
const e = require("cors");

module.exports = {
  async createProperty(req, res) {
    try {
      const principal = req.headers.principal; // change to req.principal for app
      // const principal = req.principal; // change to req.headers.principal for postman

      const {
        propertyName,
        propertyDescription,
        price,
        priceCurrency,
        imageList,
        videoList,
        maxOccupancy,
        rooms,
        location,
        latitude,
        longitude,
        amenities,
        propertyType,
        paymentMethods,
        phantomWalletID,
        payPalId,
        payPalSecret,
      } = req.body;

      console.log("Rooms => ", req.body);

      // const hashTxt = principal + String(latitude) + String(longitude);
      // console.log(hashTxt);

      // const hash = crypto
      //   .createHash("sha256")
      //   .update(hashTxt)
      //   .digest("base64url");
      // console.log(hash);

      // console.log("req.files", req.body);

      if (
        !propertyName ||
        !propertyDescription ||
        !price ||
        !location ||
        !latitude ||
        !longitude
      ) {
        console.log("empty");
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      if (propertyDescription.length > 700 || propertyName.length > 70) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.dataTooLarge });
      }

      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const oneMonthAfterDate = new Date(`${month + 1}/${day}/${year}`);

      // motoko integration
      const hotelData = {
        hotelId: "",
        hotelTitle: propertyName,
        hotelDes: propertyDescription,
        hotelImage: imageList[0],
        hotelLocation: location,
        hotelAvailableFrom: currentDate.toDateString(),
        hotelAvailableTill: oneMonthAfterDate.toDateString(),
        createdAt: currentDate.toDateString(),
      };

      const roomData = {
        roomType: rooms[0].roomType,
        roomPrice: rooms[0].roomPrice,
      };

      console.log("roomData : ", roomData);

      const propertyId = await req.hotelCanister.createHotel(
        hotelData,
        roomData
      );

      // ----------------------------------------

      // const propertyIDCheck = await Property.findOne({
      //   where: { propertyId: hash },
      // });

      // if (propertyIDCheck) {
      //   return res
      //     .status(400)
      //     .json({ status: false, message: "Property already exists" });
      // }

      // if (!propertyIDCheck) {
      // console.log("date : ", currentDate);
      // console.log("oneMonthAfter : ", oneMonthAfterDate);

      let newPropertyID = propertyId?.ok?.split(" ");

      console.log("Property ID : ", propertyId);
      console.log("newPropertyID : ", newPropertyID);

      const postData = {
        propertyId: newPropertyID[newPropertyID.length - 1],
        // propertyId: hash,
        propertyName,
        propertyDescription,
        userPrincipal: principal,
        price,
        priceCurrency: priceCurrency ? priceCurrency : "USDT",
        imageList:
          imageList.length > 0
            ? imageList
            : [
                "https://firebasestorage.googleapis.com/v0/b/rentspace-e58b7.appspot.com/o/hotelImage%2FFreeVector-Seaside-Hotel-Vector.jpg?alt=media&token=ba2925c4-a339-4789-b1c8-eefff2bba27f",
              ],
        videoList:
          videoList.length > 0
            ? videoList
            : [
                "https://firebasestorage.googleapis.com/v0/b/rentspace-e58b7.appspot.com/o/hotelVideo%2FWhite%20Brown%20Modern%20Minimalist%20Real%20Estate%20Open%20House%20Video.mp4?alt=media&token=2ea7cc7c-0790-4f85-bfc8-4745662f4d8f",
              ],
        maxOccupancy,
        rooms,
        location,
        latitude,
        longitude,
        likedBy: [],
        amenities,
        propertyType,
        paymentMethods,
        phantomWalletID,
        payPalId,
        payPalSecret,
        availableFrom: currentDate,
        availableTill: oneMonthAfterDate,
        createdAt: currentDate,
        updatedAt: currentDate,
      };

      const property = await Property.create(postData);
      return res
        .status(201)
        .send({ property, message: "Property created successfully" });
      // }
    } catch (error) {
      console.log("Error creating property");
      console.log(error);
      return res
        .status(400)
        .send({ message: "Error in creating property", msg: error.message });
    }
  },

  async getPropertyFilters(req, res) {
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
        latitude,
        longitude,
      } = req.query;

      console.log("req.query", req.query);

      const conditions = {};

      var date = new Date();
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var final = `${year}-${month}-${day + 1}`;
      var currentDate = new Date(final);

      var afterTwoDays = new Date(`${year}-${month}-${day + 5}`);

      const radius = appConstant.RADIUS_IN_10_KM;
      // Calculate the latitude and longitude boundaries
      const latBoundary =
        (Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI);
      const lonBoundary =
        ((Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI)) /
        Math.cos((latitude * Math.PI) / 180);

      if (name == "") {
        if (latitude && longitude && latitude != "0" && longitude != "0") {
          conditions.latitude = {
            [Op.between]: [+latitude - latBoundary, latitude + latBoundary],
          };
          conditions.longitude = {
            [Op.between]: [+longitude - lonBoundary, longitude + lonBoundary],
          };
        }
      }

      if (name) {
        conditions.propertyName = {
          [Op.iLike]: `%${name}%`,
        };
      }

      if (minPrice && maxPrice) {
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
        const amenitiesArray = amenities.split(",");
        console.log("req amen : ", amenitiesArray); // Changed to amenitiesArray
        conditions.amenities = {
          [Op.overlap]: [...amenitiesArray], // Changed to amenitiesArray
        };
      }
      
      // -------------------------------------

      // if (currentDate) {
      //   conditions.availableFrom = {
      //     [Op.lte]: currentDate,
      //   };
      //   conditions.availableTill = {
      //     [Op.gte]: afterTwoDays,
      //   };
      // }

      // Calculate offset based on pagination parameters
      const offset = (page - 1) * pageSize;

      // console.log("conditions : ", conditions);

      const filteredPropertiesDB = await Property.findAll({
        where: conditions,
        offset: offset,
        limit: pageSize,
      });

      // ----------------- RateHawk API -----------------

      // searching hotels from RateHawk API based on coordinates

      var AllApiHotels = [];
      var AllApiHotelsIDs = [];

      const newRHHotels = await searchRatehawkHotels({
        latitude,
        longitude,
        totalHotels: 5, // hardcoded for now to get 5 hotels only from Dump
      });

      console.log("filteredPropertiesDB : ", filteredPropertiesDB.length);
      console.log("New ratehawk Hotels Length : ", typeof newRHHotels);

      if (
        typeof newRHHotels === "object" &&
        newRHHotels?.final_hotels?.length !== 0
      ) {
        // if (newRHHotels?.final_hotels?.length !== 0) {
        AllApiHotels = newRHHotels.final_hotels;
        AllApiHotelsIDs = newRHHotels.final_hotels_Id;
      } else {
        AllApiHotels = [];
        AllApiHotelsIDs = [];
      }

      // searching hotels from RateHawk API baswd on location

      // const searchString = name ? name : "hotel" + " " + location;

      // console.log("Searched Hotels from RateHawk API : " + searchString);

      // const apiHotels = await searchHotel({
      //   query: searchString,
      //   language: "en",
      // });

      // if (!isEmpty(apiHotels)) {
      //   AllApiHotels = apiHotels;
      // } else {
      //   AllApiHotels = [];
      // }

      // returning filtered hotels from RateHawk API and DB

      if (filteredPropertiesDB.length == 0 && AllApiHotels.length == 0) {
        console.log("No hotels found in DB and API");
        return res.json({
          status: false,
          hotels: [],
          externalHotels: [],
          externalHotelsIDs: [],
        });
      }
      if (filteredPropertiesDB.length == 0 && AllApiHotels.length != 0) {
        console.log("Hotel found in API only");
        return res.json({
          status: true,
          hotels: [],
          externalHotels: AllApiHotels,
          externalHotelsIDs: AllApiHotelsIDs,
        });
      }
      if (filteredPropertiesDB.length != 0 && AllApiHotels.length == 0) {
        console.log("Hotel found in DB only");
        return res.json({
          status: true,
          hotels: filteredPropertiesDB,
          externalHotels: [],
          externalHotelsIDs: [],
        });
      }
      if (filteredPropertiesDB.length != 0 && AllApiHotels.length != 0) {
        console.log("Hotel found in both DB and API");
        return res.json({
          status: true,
          hotels: filteredPropertiesDB,
          externalHotels: AllApiHotels,
          externalHotelsIDs: AllApiHotelsIDs,
        });
      }
      // return res.status(200).send({ properties: filteredPropertiesDB });
    } catch (error) {}
  },

  async getAllProperties(req, res) {
    try {
      const userPrincipal = req.query.userPrincipal;
      const properties = await Property.findAll({ where: { userPrincipal } });
      if (properties.length == 0) {
        console.log("No properties found");
        return res.status(404).send({ message: "No properties found" });
      }
      return res.status(200).send({ properties });
    } catch (error) {
      return res.status(400).send({ message: "Error in getting properties" });
    }
  },

  async deleteProperty(req, res) {
    try {
      const propertyId = req.body.propertyId;
      console.log(propertyId);
      console.log(req.hotelCanister);

      const property = await Property.findOne({ where: { propertyId } });

      await req.hotelCanister.deleteHotel(propertyId);
      await property.destroy();
      console.log("Hotel deleted successfully");
      res.json({ status: true, message: successMessages.hotelDeleted });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async updateProperty(req, res) {
    try {
      const {
        propertyId,
        propertyName,
        propertyDescription,
        price,
        imageList,
        videoList,
        location,
        amenities,
        propertyType,
        paymentMethods,
        rooms,
        maxOccupancy,
        phantomWalletID,
        payPalId,
        payPalSecret,
      } = req.body;

      console.log(req.body);

      const updateFields = {};

      if (propertyName) {
        updateFields.propertyName = propertyName;
      }
      if (propertyDescription) {
        updateFields.propertyDescription = propertyDescription;
      }
      if (price) {
        updateFields.price = price;
      }
      if (imageList) {
        updateFields.imageList = imageList;
      }
      if (videoList) {
        updateFields.videoList = videoList;
      }
      if (location) {
        updateFields.location = location;
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
      if (rooms) {
        updateFields.rooms = rooms;
      }

      if (maxOccupancy) {
        updateFields.maxOccupancy = maxOccupancy;
      }

      if (phantomWalletID) {
        updateFields.phantomWalletID = phantomWalletID;
      }

      if (payPalId && payPalSecret) {
        updateFields.payPalId = payPalId;
        updateFields.payPalSecret = payPalSecret;
      }

      const finalData = {
        ...updateFields,
        updatedAt: new Date(),
      };

      // console.log("finalData : ", finalData);

      // Finding and updating the hotel in postgres
      const property = await Property.findOne({ where: { propertyId } });

      if (!property) {
        return res
          .status(400)
          .json({ status: false, message: errorMessages.hotelNotFound });
      }
      if (property) {
        // motoko integration
        const hotelData = {
          hotelId: propertyId,
          hotelTitle: finalData.propertyName
            ? finalData.propertyName
            : property.propertyName,
          hotelDes: finalData.propertyDescription
            ? finalData.propertyDescription
            : property.propertyDescription,
          hotelImage:
            finalData.imageList?.length > 0
              ? finalData.imageList[0]
              : property.imageList[0],
          hotelLocation: finalData.location
            ? finalData.location
            : property.location,
          hotelAvailableFrom: property.availableFrom.toDateString(),
          hotelAvailableTill: property.availableTill.toDateString(),
          createdAt: property.createdAt.toDateString(),
        };

        const roomData = {
          roomType: finalData.rooms[0].roomType,
          roomPrice: Number(finalData.rooms[0].roomPrice),
        };

        const motokoResponse = await req.hotelCanister.updateHotel(
          hotelData,
          roomData
        );
        console.log(motokoResponse);

        await Property.update(finalData, { where: { propertyId } });

        console.log("Property updated successfully");

        return res.json({
          status: true,
          message: successMessages.hotelUpdated,
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async updatePropertyAvailability(req, res) {
    try {
      const { propertyId, availableFrom, availableTill } = req.body;

      console.log(req.body);

      const property = await Property.findOne({ where: { propertyId } });

      if (!property) {
        return res.status(404).send({ message: "Property not found" });
      }

      if (property) {
        await Property.update(
          {
            availableFrom,
            availableTill,
            updatedAt: new Date(),
          },
          { where: { propertyId } }
        );
        return res
          .status(200)
          .send({ message: "Property availability updated successfully" });
      }
      // return res.status(200).send({ property });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  // ------ Reel Functions ------

  async getLikesOnProperty(req, res) {
    try {
      const propertyId = req.params.propertyId;
      console.log("propertyId to get reel likes: ", propertyId);
      const property = await Property.findOne({ where: { propertyId } });

      if (!property) {
        return res.status(404).send({ message: "Property not found" });
      }

      if (property) {
        console.log(property.likedBy.length);
        return res.status(200).send({ likes: property.likedBy?.length });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async updateLikesOnProperty(req, res) {
    try {
      const { propertyId, userPrincipal } = req.body;

      if (!isEmpty(propertyId) && !isEmpty(userPrincipal)) {
        console.log(req.body);
        const property = await Property.findOne({ where: { propertyId } });
        if (!property) {
          return res.status(404).send({ message: "Property not found" });
        }
        if (property) {
          const likedBy = property.likedBy;

          if (likedBy.includes(userPrincipal)) {
            const index = likedBy.indexOf(userPrincipal);
            likedBy.splice(index, 1); // remove user from likedBy array if already liked
          } else {
            likedBy.push(userPrincipal); // add user to likedBy array if not liked
          }

          await Property.update({ likedBy }, { where: { propertyId } });

          const prop = await Property.findOne({ where: { propertyId } });

          return res.status(200).send({
            message: "Likes updated successfully",
            likes: prop.likedBy.length,
          });
        }
      } else {
        return res
          .status(400)
          .json({ status: false, message: "Cannot proceed without data" });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getPropertyReelData(req, res) {
    try {
      // const userLatitude = req.header.latitude;
      // const userLongitude = req.header.longitude;
      // let radius = req.header.radius;

      let { userLatitude, userLongitude, radius } = req.query;

      console.log(userLatitude, userLongitude, radius);

      if (_.isEmpty(userLatitude) || _.isEmpty(userLongitude)) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      if (_.isEmpty(radius)) {
        radius = appConstant.RADIUS_IN_10_KM;
      }

      const latBoundary =
        (Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI);
      const lonBoundary =
        ((Number(radius) / appConstant.EARTH_RADIUS_IN_KM) * (180 / Math.PI)) /
        Math.cos((userLatitude * Math.PI) / 180);

      const nearbyProperties = await Property.findAll({
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

      if (nearbyProperties.length > 0) {
        return res
          .status(200)
          .json({ status: true, properties: nearbyProperties });
      } else {
        const latestProperties = await Property.findAll({
          order: [["createdAt", "DESC"]],
          limit: 10,
        });

        return res
          .status(200)
          .json({ status: true, properties: latestProperties });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },
};
