const { hotel } = require("../motoko/hotel");

const RateHawkUrls = {
    searchUrl: "https://api.worldota.net/api/b2b/v3/search/multicomplete/",
    hotelInfoUrl: "https://api.worldota.net/api/b2b/v3/hotel/info/",
    hotelBookUrl: "https://api.worldota.net/api/b2b/v3/search/hp/",
    preBookUrl : "https://api.worldota.net/api/b2b/v3/hotel/prebook/",
}

module.exports = RateHawkUrls;