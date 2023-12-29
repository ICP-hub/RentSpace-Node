const { Images } = require("../models/images");

module.exports = {
  async createHotel(req, res) {
    try {
      const hotelId = req.body.hotelId;
      const hotelLocation = req.body.hotelLocation;
      const hotelResource = req.files;
      let hotelImagePath = [];
      let hotelVideoPath;
      for (const i in hotelResource) {
        if (i.mimetype == "images/") {
          hotelImagePath.append(i.path);
        }
        if (i.mimetype == "videos/") {
          hotelVideoPath = i.path;
        }
      }

      let user = await Images.findOne({ where: { hotelId } });
      if (user) {
        res.status(400).json({ staus: false, error: "Hotel Already Exist" });
      }

      await Images.create({
        hotelId: hotelId,
        hotelImagePath: hotelImagePath,
        hotelVideoPath: hotelVideoPath,
        hotelLocation: hotelLocation,
      });

      return res.status(201).json({ staus: true, message: "Hotel created" });
    } catch (error) {
      console.log("Error", error.message);
      return res
        .status(500)
        .json({ status: false, error: "Internal server Error" });
    }
  },
};
