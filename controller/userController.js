const bcrypt = require("bcrypt");
const { User } = require("../models/User");
const { isValidPrincipal } = require("../helper/isValidPrincipal");
const { fromHex } = require("@dfinity/agent");
const signatureVerification = require("../helper/signatureVerification");

module.exports = {
  async registerUser(req, res) {
    try {
      const { principal, publicKey, signature } = req.body;

      let encoder = new TextEncoder();
      let message = encoder.encode(principal);
      let isVerified = await signatureVerification(
        publicKey,
        signature,
        message
      );

      const privateToken = await bcrypt.hash(publicKey, 10);
      const isPrincipal = isValidPrincipal(principal);
      if (!isPrincipal || !isVerified) {
        return res.status(401).json({ status: false, error: "Unautherized" });
      }

      let user = await User.findOne({ where: { principal } });

      if (user) {
        return res
          .status(400)
          .json({ status: false, error: "User already exist" });
      }

      // Create the user in the database
      await User.create({
        principal,
        privateToken,
        publicToken: publicKey,
      });

      return res
        .status(201)
        .json({ status: true, message: "User created successfully" });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
  },

  async getUser(req, res) {
    try {
      const { principal, publicKey } = req.body;

      // find the user in the database
      let userToken = await User.findOne({ where: { principal } });
      const isValid = await bcrypt.compare(publicKey, userToken.privateToken);
      if (!isValid) {
        return res
          .status(401)
          .json({ status: false, error: "Unautherized access" });
      }

      return res.status(201).json({
        status: true,
        message: "User find successfully",
        isValid,
        userToken: userToken.privateToken,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res
        .status(500)
        .json({ status: false, error: "Internal Server Error" });
    }
  },
};
