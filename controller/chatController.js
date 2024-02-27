const { isValidPrincipal } = require("../helper/isValidPrincipal");
const History = require("../models/History");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const errorMessages = require("../config/errorMessages.json");
const { Op } = require("sequelize");
const crypto = require("crypto")

module.exports = {
  async getHistory(req, res) {
    try {
      const { principal } = req.user;
      const chatHistory = await History.findAll({
        where: {
          [Op.or]: [{ fromPrincipal: principal }, { toPrincipal: principal }],
        },
        order: [['updatedAt', 'DESC']],
      });
      return res.json({ status: true, historyUsers: chatHistory });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getSpecificUserMessage(req, res) {
    try {
      const { principal } = req.params;
      const isValid = isValidPrincipal(principal);
      if (!isValid) {
        return res.status(401).json({ error: errorMessages.unauthorized });
      }
      const user = await User.findOne({ where: { principal } });
      if (!user) {
        return res.status(400).json({ error: errorMessages.userNotFound });
      }
      const userChat = await Message.findAll({
        where: {
          [Op.or]: [
            {
              [Op.and]: [
                { fromPrincipal: { [Op.in]: [principal] } },
                { toPrincipal: { [Op.in]: [req.user.principal] } },
              ],
            },
            {
              [Op.and]: [
                { fromPrincipal: { [Op.in]: [req.user.principal] } },
                { toPrincipal: { [Op.in]: [principal] } },
              ],
            },
          ],
        },
        order: [["createdAt", "ASC"]],
      });
      let chatHistoryEncrypted = []

      userChat.map(msg => chatHistoryEncrypted.push(msg.toJSON()))


      let chatHistoryDecrypted = []
      chatHistoryEncrypted.map(msg => {

        const algo = 'aes256'
        const key = Buffer.from("6d792d7365637265742d6b65792d6b6579123489272b72d27287a2727a272738", "hex")

        const decipher = crypto.createDecipheriv(algo, key, msg.iv)
        const decrypted = decipher.update(msg.message, 'hex', 'utf-8') + decipher.final('utf-8')

        chatHistoryDecrypted.push({
          id: msg.id,
          fromPrincipal: msg.fromPrincipal,
          toPrincipal: msg.toPrincipal,
          message: decrypted,
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt
        })
      })

      return res.json({ status: true, messages: chatHistoryDecrypted });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },
};
