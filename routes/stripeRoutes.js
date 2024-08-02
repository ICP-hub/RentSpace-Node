const route = require("express").Router();
const {
  createAccount,
  createAccountLink,
  createPaymentIntent,
  checkout,
} = require("../controller/stripeController");

route.post("/account", createAccount);
route.post("/account_link", createAccountLink);
route.post("/payment_intent", createPaymentIntent);
route.post("/checkout",checkout);

module.exports = route;
