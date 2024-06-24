const { hotel, createActor } = require("../motoko/Hotel");
const errorMessages = require("../config/errorMessages.json");

module.exports = {
  createHotelActor(req, res, next) {
    console.log("Create Actor")
    try {
      const agent = req.agent;
      let hotelCanister = createActor(process.env.HOTEL_CANISTER_ID, {
        agent,
      });
      console.log("hotelCanister", hotelCanister);
      req.hotelCanister = hotelCanister;
      next();
    } catch (error) {
      console.error("createHotelActor Error : ", error);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },
};
