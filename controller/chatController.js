const { isValidPrincipal } = require("../helper/isValidPrincipal");
const History = require("../models/History");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const errorMessages = require("../config/errorMessages.json");

module.exports = {
  async getHistory(req, res) {
    try {
      const chatHistory = await History.findAll({
        where: { fromPrincipal: req.user.principal },
      });
      return res.json({ status: true, historyUsers: chatHistory.reverse() });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getSpecificUserMessage(req, res) {
    try {
      const principal = req.params.principal;
      const isValid = isValidPrincipal(principal);
      if (!isValid) {
        return res.status(401).json({ error: errorMessages.unauthorized });
      }
      const user = await User.findOne({ where: { principal } });
      if (!user) {
        return res.status(400).json({ error: errorMessages.userNotFound });
      }
      const userChat = await Message.findAll({
        where: { fromPrincipal: req.user.principal, toPrincipal: principal },
        order: [["createdAt", "ASC"]],
      });
      return res.json({ status: true, messages: userChat.reverse() });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },
};
