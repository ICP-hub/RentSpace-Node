const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { isValidPrincipal } = require("../helper/isValidPrincipal");
const errorMessages = require("../config/errorMessages.json");
const appConstant = require("../config/appConstant.json");
const successMessages = require("../config/successMessages.json");
const signatureVerification = require("../helper/signatureVerification");

module.exports = {
  async registerUser(req, res) {
    try {
      const { principal, publicKey } = req;

      if (_.isEmpty(publicKey) || _.isEmpty(principal)) {
        return res
          .status(400)
          .send({ status: false, error: errorMessages.invalidData });
      }

      // check principal or signature is valid
      const isPrincipal = isValidPrincipal(principal);
      if (!isPrincipal) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.invalidData });
      }

      // if User is already exist
      let user = await User.findOne({ where: { principal } });
      if (user) {
        return res
          .status(400)
          .json({ status: false, error: errorMessages.userAlreadyExists });
      }

      const privateToken = await bcrypt.hash(publicKey, 10);

      // Create the user in the database
      await User.create({
        principal,
        privateToken,
        userType: appConstant.TYPE_USER,
        publicToken: publicKey,
      });

      return res
        .status(200)
        .json({ status: true, message: successMessages.userCreated });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },

  async getUser(req, res) {
    try {
      const principal = await req.principal;
      if (_.isEmpty(principal)) {
        return res
          .status(400)
          .send({ status: false, error: errorMessages.invalidData });
      }

      // find the user in the database
      let user = await User.findOne({ where: { principal: principal } });
      if (_.isEmpty(user)) {
        return res
          .status(404)
          .json({ status: false, error: errorMessages.userNotFound });
      }
      return res.status(201).json({
        status: true,
        message: successMessages.userFindSuccess,
        userToken: user.privateToken,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: errorMessages.internalServerError });
    }
  },
};
