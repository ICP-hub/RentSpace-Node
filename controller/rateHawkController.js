const RateHawkUrls = require("../config/rateHawkUrls");
const { default: axios } = require("axios");
const { exec } = require("child_process");
const path = require("path");
const { Booking } = require("../models/Booking");
const { hotel } = require("../motoko/Hotel");
const { property } = require("underscore");
const { or } = require("sequelize");

const username = process.env.RATEHAWK_USERNAME; // rate hawk api's for hotel
const password = process.env.RATEHAWK_PASSWORD;

// rate hawk api's for hotel

const databaseData = {
  bookingId: "",
  userId: "",
  propertyID: "",
  propertyName: "",
  propertyLocation: "",
  checkInDate: "",
  checkOutDate: "",
  bookingDate: "",
  guestDetails: [],
  bookingStatus: "",
  paymentStatus: "",
  email: "",
  phone: "",
};

// function to generate UUID

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function fetchHotelsFromPythonScript(latitude, longitude, totalHotels) {
  return new Promise((resolve, reject) => {
    // path to python script in same dir
    const pythonScriptPath = path.join(__dirname, "../controller/main.py");

    if (
      latitude === undefined ||
      longitude === undefined ||
      totalHotels === undefined ||
      latitude === "0" ||
      longitude === "0" ||
      totalHotels === "0"
    ) {
      console.error("Latitude, Longitude or Total Hotels not provided");
      reject("Latitude, Longitude or Total Hotels not provided");
      return;
    } else {
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);
      console.log("Total Hotels:", totalHotels);

      const command = `python "${pythonScriptPath}" ${latitude} ${longitude} ${totalHotels}`;

      console.log("Command:", command);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          reject(error);
          return;
        }
        if (stderr) {
          console.error(`Python script stderr: ${stderr}`);
        }
        try {
          console.log("Stdout = ", typeof(stdout.length));

          const hotels = JSON.parse(stdout);

          if (hotels.length === 0) {
            console.log("No hotels found");
            reject("No hotels found");
            return;
          }
          resolve(hotels);
        } catch (parseError) {
          console.error(`Error parsing JSON: ${parseError}`);
          reject(parseError);
        }
      });
    }
  });
}

module.exports = {
  // new function to search hotel by coordinates and total number of hotels

  // async searchRatehawkHotels(req, res) {
  //   try {
  //     const { latitude, longitude, totalHotels } = req.body;

  //     const postData = {
  //       latitude: latitude,
  //       longitude: longitude,
  //       totalHotels: totalHotels,
  //     };

  //     console.log("API CAlled");
  //     res.json({ status: true, data: postData });
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     res.json({ status: false, msg: error.message });
  //   }
  // },

  async searchRatehawkHotels({ latitude, longitude, totalHotels }) {
    const Hotels = await fetchHotelsFromPythonScript(
      latitude,
      longitude,
      totalHotels
    );
    // console.log("Hotels fetched:", Hotels);
    return Hotels;
  },

  // function to get hash for sample hotel
  async getHashForSampleHotel(req, res) {
    const { checkInDate, checkOutDate, adults, children } = req.body;

    const postData = {
      id: "test_hotel",
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

    try {
      const response = await axios.post(RateHawkUrls.hotelBookUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log("Response sent for Rate Hawk Sample Hotel");
      console.log(response.data);
      res.json({ status: true, data: response.data });
    } catch (error) {
      console.error("Error:", error.message);
      res.json({ status: false, msg: error.message });
    }
  },

  // function to search hotel by city or hotel name (used earlier)
  // async searchHotel({ query, language }) {
  //   const postData = {
  //     query: query,
  //     language: language,
  //   };

  //   try {
  //     const response = await axios.post(RateHawkUrls.searchUrl, postData, {
  //       auth: {
  //         username: username,
  //         password: password,
  //       },
  //     });
  //     const hotels = response.data?.data?.hotels;
  //     const finalHotelList = [];
  //     const hotelIdList = [];

  //     hotels.forEach(async (hotel) => {
  //       hotelIdList.push(hotel.id);
  //     });

  //     console.log("Query :", query);
  //     console.log("Hotel Id List:", hotelIdList);

  //     // traverse each item in hotels array and add hotel id in hotelIdList
  //     for (let i = 0; i < hotels.length; i++) {
  //       // console.log("Hotel Id:", hotels[i].id);

  //       const date = new Date();
  //       var day = date.getDate();
  //       var month = date.getMonth() + 1;
  //       const year = date.getFullYear();

  //       var checkOutDay = day + 5;

  //       if (day < 10) {
  //         day = `0${day}`;
  //       }
  //       if (month < 10) {
  //         month = `0${month}`;
  //       }
  //       if (checkOutDay < 10) {
  //         checkOutDay = `0${checkOutDay}`;
  //       }

  //       var checkInDate = new Date(`${year}-${month}-${day}`)
  //         .toISOString()
  //         .slice(0, 10);
  //       var checkOutDate = `${year}-${month}-${checkOutDay}`;

  //       // console.log("Check In Date:", checkInDate);
  //       // console.log("Check Out Date:", checkOutDate);

  //       const postData = {
  //         id: hotels[i].id,
  //         checkin: checkInDate,
  //         checkout: checkOutDate,
  //         language: "en",
  //         guests: [
  //           {
  //             adults: 2,
  //             children: [],
  //           },
  //         ],
  //       };

  //       try {
  //         const hotelResponse = await axios.post(
  //           RateHawkUrls.hotelBookUrl,
  //           postData,
  //           {
  //             auth: {
  //               username: username,
  //               password: password,
  //             },
  //           }
  //         );
  //         if (hotelResponse?.data?.data?.hotels[0]?.rates[0]?.book_hash) {
  //           finalHotelList.push(hotels[i]);
  //         }
  //       } catch (error) {
  //         console.error("Error:", error.message);
  //         console.log("Error in hash check response");
  //       }
  //     }

  //     console.log("Final Hotel List Outer :", finalHotelList);

  //     return finalHotelList;
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //     return "Facing issue in fetching hotels. Please try again later.";
  //   }
  // },

  // (not in use anymore  - used earlier)
  // async getHotelInfo(req, res) {
  //   const { hotelId, language } = req.body;

  //   const postData = {
  //     id: hotelId,
  //     language: language,
  //   };

  //   try {
  //     const response = await axios.post(RateHawkUrls.hotelInfoUrl, postData, {
  //       auth: {
  //         username: username,
  //         password: password,
  //       },
  //     });
  //     console.log("Response sent");
  //     res.json({ status: true, data: response.data });
  //   } catch (error) {
  //     console.error("Error:", error.message);
  //   }
  // },

  // function to get all room rates for a hotel
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

    // set data to databaseData

    databaseData.propertyID = hotelId;
    databaseData.checkInDate = checkInDate;
    databaseData.checkOutDate = checkOutDate;
    databaseData.guestDetails = postData.guests;

    console.log(databaseData);

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

  // fucntion for Preebook Endpoint
  async preBook(req, res) {
    const { hash, price_increase_percent } = req.body;

    const postData = {
      hash: hash,
      price_increase_percent: price_increase_percent,
    };

    try {
      const response = await axios.post(RateHawkUrls.preBookUrl, postData, {
        auth: {
          username: username,
          password: password,
        },
      });
      console.log("Response sent for Rate Hawk Pre Book");
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

    console.log("Database Data:", databaseData);

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
