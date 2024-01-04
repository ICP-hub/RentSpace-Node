const route = require("express").Router();
const { registerUser, getUser } = require("../controller/userController");

route.post("/register/user",registerUser);
route.post("/login/user",getUser);
module.exports = route;
