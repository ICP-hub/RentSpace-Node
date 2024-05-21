const RateHawkUrls = require("../config/rateHawkUrls");
const { default: axios } = require("axios");

// const username = "7853"; // need to be hidden in production
// const password = "f30da66d-f19c-49f8-832f-856340962343"; // need to be hidden in production

const username = process.env.RATEHAWK_USERNAME; // rate hawk api's for hotel
const password = process.env.RATEHAWK_PASSWORD;


// rate hawk api's for hotel

module.exports = {
  // search hotel by city or hotel name
  async searchHotel({ query, language }) {
    const postData = {
      query: query,
      language: language,
    };

    try {
      const response = await axios.post(RateHawkUrls.searchUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      });
      const hotels = response.data?.data?.hotels;
      return hotels;
    } catch (error) {
      console.error("Error:", error.message);
      return "Facing issue in fetching hotels. Please try again later.";
    }
  },

  async getHotelInfo(req, res) {
    const { hotelId, language } = req.body;

    const postData = {
      id: hotelId,
      language: language,
    };

    await axios
      .post(RateHawkUrls.hotelInfoUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      })
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
    const { hotelId, checkInDate, checkOutDate, adults, children } = req.body;

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
      .post(RateHawkUrls.hotelBookUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      })
      .then((response) => {
        console.log("Response sent");
        res.json({ status: true, data: response.data });
      })
      .catch((error) => {
        console.error("Error:", error.message);
      });
  },
};
