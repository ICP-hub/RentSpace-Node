const { Hotels } = require("../models/hotel");
const fs = require("fs");
const { hotel, createActor } = require("../hotel/index.js");
module.exports = {
  async createHotel(req, res) {
    try {
      // console.log("ICP  " + (await hotel.getHotelId()));
      const hotelTitle = toString(req.body.hotelTitle);
      const hotelDes = toString(req.body.hotelDes);
      const hotelPrice = toString(req.body.hotelPrice);
      const createdAt = toString(Date.now());
      const hotelLocation = req.body.hotelLocation;

      const hotelImagePath = [];
      let hotelImage = req.files.images;
      let hotelVideoPath = req.files.videos[0].path;

      for (const i of hotelImage) {
        hotelImagePath.push(i.path);
      }
      if (!req.files) {
        return res.status(400).send("No file uploaded");
      }

      const hotelData = {
        hotelTitle: hotelTitle,
        hotelDes: hotelDes,
        hotelImage: hotelImagePath,
        hotelPrice: hotelPrice,
        hotelLocation: hotelLocation.toString(),
        createdAt: createdAt,
      };
      const hotelId = await hotel.createHotel(hotelData);
      console.log(hotelId);
      await Hotels.create({
        hotelId: hotelId,
        hotelImagePath: hotelImagePath,
        hotelVideoPath: hotelVideoPath,
        hotelLocation: hotelLocation,
      });

      return res.status(201).json({ staus: true, message: "Hotel created" });
    } catch (error) {
      console.log("Error", error.message);

      if (req.files) {
        if (req.files.images) {
          req.files.images.forEach((file) => {
            fs.unlink(file.path, (err) => {
              if (err)
                console.error("Error deleting file:", file.path, err.message);
            });
          });
        }

        if (req.files.videos && req.files.videos.length > 0) {
          fs.unlink(req.files.videos[0].path, (err) => {
            if (err)
              console.error(
                "Error deleting file:",
                req.files.videos[0].path,
                err.message
              );
          });
        }
      }
      console.log("Error", error.message);
      return res
        .status(500)
        .json({ status: false, error: "Internal server Error" });
    }
  },
};
