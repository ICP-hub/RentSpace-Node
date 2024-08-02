const userRoutes = require("./userRoutes");
const chatRoute = require("./chatRoutes");
const hotelRoutes = require("./hotelRoutes");
const rateHawkRoutes = require('./rateHawkRoutes')
const propertyRoutes = require('./propertyRoutes');
const stripeRoutes = require("./stripeRoutes");
const checkOutRoutes  = require("./checkOutRoutes");

module.exports = {
  userRoutes,
  chatRoute,
  hotelRoutes,
  rateHawkRoutes,
  propertyRoutes,
  stripeRoutes,
  checkOutRoutes,
};
