const { getHistory, getSpecificUserMessage } = require("../controller/chatController");
const validateUser = require("../middleware/auth");

const route = require("express").Router();

route.post("/chat/history",validateUser,getHistory);
route.post("/chat/:principal",validateUser,getSpecificUserMessage);
module.exports = route;
