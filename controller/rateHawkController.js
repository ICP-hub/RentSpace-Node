const RateHawkUrls = require("../config/rateHawkUrls");
const { default: axios } = require("axios");

// const username = "7853"; // need to be hidden in production
// const password = "f30da66d-f19c-49f8-832f-856340962343"; // need to be hidden in production

const username = process.env.RATEHAWK_USERNAME; // rate hawk api's for hotel
const password = process.env.RATEHAWK_PASSWORD;

// rate hawk api's for hotel

// function to generate UUID

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

module.exports = {
  // function to search hotel by city or hotel name
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
      const finalHotelList = [];
      const hotelIdList = [];

      hotels.forEach(async (hotel) => {
        hotelIdList.push(hotel.id);
      });

      console.log("Query :", query);
      console.log("Hotel Id List:", hotelIdList);

      // traverse each item in hotels array and add hotel id in hotelIdList
      for (let i = 0; i < hotels.length; i++) {
        console.log("Hotel Id:", hotels[i].id);

        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const checkInDate = `${year}-0${month}-${day}`;
        // const checkOutDate = `${year}-0${month+1}-${day}`;
        // check out date is 15 days from check in date also deal with month end date

        console.log("Check In Date:", checkInDate);
        // console.log("Check Out Date:", checkOutDate);
        // console.log("Check Out Date:", checkOutDate);

        const postData = {
          id: hotels[i].id,
          checkin: checkInDate,
          checkout: "2024-06-07",
          language: "en",
          guests: [
            {
              adults: 2,
              children: [],
            },
          ],
        };

        try {
          const hotelResponse = await axios.post(
            RateHawkUrls.hotelBookUrl,
            postData,
            {
              auth: {
                username: username,
                password: password,
              },
            }
          );
          if (hotelResponse?.data?.data?.hotels[0]?.rates[0]?.book_hash) {
            finalHotelList.push(hotels[i]);
          }
        } catch (error) {
          console.error("Error:", error.message);
          console.log("Error in hash check response");
        }
      }

      console.log("Final Hotel List Outer :", finalHotelList);

      return finalHotelList;
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

    try {
      const response = await axios.post(RateHawkUrls.hotelInfoUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log("Response sent");
      res.json({ status: true, data: response.data });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

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

    console.log(hotelId);

    try {
      const response = await axios.post(RateHawkUrls.hotelBookUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log("Response sent for Rate Hawk Book Hotel");
      // console.log(response.data.data.hotels[0].rates[0].book_hash);
      console.log(response.data);
      res.json({ status: true, data: response.data });
    } catch (error) {
      console.error("Error:", error.message);
    }
  },

  // API endpoint to check if hash is available for hotel {for manual testing purpose, not used in frontend integration}
  async checkhash(req, res) {
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

    console.log(hotelId);

    try {
      await axios
        .post(RateHawkUrls.hotelBookUrl, postData, {
          auth: {
            username: username,
            password: password,
          },
        })
        .then((response) => {
          if (response?.data?.data?.hotels[0]?.rates[0]?.book_hash) {
            console.log("Hash Available for hotel id:", hotelId);
            res.json({
              status: true,
              message: "Hash available for this hotel",
            });
          } else {
            console.log("Hash not available for hotel id:", hotelId);
            res.json({
              status: false,
              message: "Hash not available for this hotel",
            });
          }
        })
        .catch((error) => {
          console.error("Error:", error.message);
          console.log("Error in hash check response");
          res.json({ status: false, msg: error.message });
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },

  // -----------------------------------------------

  // order booking form function
  async orderBookingForm(req, res) {
    const { book_hash, language, user_ip } = req.body;

    const partner_order_id = generateUUID();

    console.log("Partner Order Id:", partner_order_id);

    const postData = {
      partner_order_id: partner_order_id,
      book_hash: book_hash,
      language: language,
      user_ip: user_ip,
    };

    try {
      await axios
        .post(
          "https://api.worldota.net/api/b2b/v3/hotel/order/booking/form/",
          postData,
          {
            auth: {
              username: username,
              password: password,
            },
          }
        )
        .then((response) => {
          console.log("Response sent for order booking form");

          const payment_type = [];

          response.data.data.payment_types.forEach((item) => {
            if (item.currency_code === "USD") {
              payment_type.push(item);
            }
          });

          res.json({
            status: true,
            data: {
              item_id: response.data.data.item_id,
              partner_order_id: partner_order_id,
              payment_type: payment_type,
            },
          });
        })
        .catch((error) => {
          console.error("Error:", error.message);
          res.json({ status: false, msg: error.message });
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },

  // Credit card tokenization function
  async crediCardTokenization(req, res) {
    const {
      object_id,
      user_last_name,
      user_first_name,
      cvc,
      is_cvc_required,
      year,
      card_number,
      card_holder,
      month,
    } = req.body;

    const pay_uuid = generateUUID();
    const init_uuid = generateUUID();

    console.log("Object ID:", object_id);
    console.log("Pay UUID:", pay_uuid);
    console.log("Init UUID:", init_uuid);

    const postData = {
      object_id: object_id,
      pay_uuid: pay_uuid,
      init_uuid: init_uuid,
      user_last_name: user_last_name,
      user_first_name: user_first_name,
      cvc: cvc,
      is_cvc_required: is_cvc_required,
      credit_card_data_core: {
        year: year,
        card_number: card_number,
        card_holder: card_holder,
        month: month,
      },
    };

    try {
      await axios
        .post(
          "https://api.payota.net/api/public/v1/manage/init_partners",
          postData,
          {
            auth: {
              username: username,
              password: password,
            },
          }
        )
        .then((response) => {
          console.log("Response sent for credit card tokenization");
          res.json({ status: true, data: response.data, pay_uuid, init_uuid });
        })
        .catch((error) => {
          console.error("Error:", error.message);
          res.json({ status: false, msg: error.message });
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },

  // Order Book Finish function
  async orderBookFinish(req, res) {
    const {
      email,
      phone,
      partner_order_id,
      language,
      guests,
      payment_type,
      return_path,
    } = req.body;

    const postData = {
      user: { email, phone },
      partner: { partner_order_id },
      language,
      rooms: [{ guests }],
      payment_type: payment_type,
      return_path: return_path,
    };

    try {
      await axios
        .post(
          "https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/",
          postData,
          {
            auth: {
              username: username,
              password: password,
            },
          }
        )
        .then((response) => {
          console.log("Response sent for order book finish");
          res.json({ status: true, data: response.data });
        })
        .catch((error) => {
          console.error("Error:", error.message);
          res.json({ status: false, msg: error.message });
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },

  // order book finish status function
  async orderBookFinishStatus(req, res) {
    const { partner_order_id } = req.body;

    try {
      await axios
        .post(
          "https://api.worldota.net/api/b2b/v3/hotel/order/booking/finish/status/",
          { partner_order_id },
          {
            auth: {
              username: username,
              password: password,
            },
          }
        )
        .then((response) => {
          console.log("Response sent for order book finish status");
          res.json({ status: true, data: response.data });
        })
        .catch((error) => {
          console.error("Error:", error.message);
          res.json({ status: false, msg: error.message });
        });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },
};
