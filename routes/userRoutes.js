const route = require("express").Router();
const { registerUser, getUser } = require("../controller/userController");
const { verifyDelegation } = require("../middleware/authICPDelegation");

route.post("/register/user",verifyDelegation,registerUser);
route.post("/login/user",verifyDelegation,getUser);
module.exports = route;
