const http = require("http");
const socketIO = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const app = require("../index");
const { findSocketByPrincipal } = require("./helpers/findSocket");
const History = require("../models/History");
const { Op } = require("sequelize");
const server = http.createServer(app);
const io = socketIO(server);
const crypto = require('crypto')

principalSocketMap = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("setPrincipal", (principal) => {
    principalSocketMap[principal] = socket.id;
    console.log(`Socket connected for principal: ${principal}`);
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { fromPrincipal, toPrincipal, message, privateToken } =
        JSON.parse(data);

      if (
        _.isEmpty(privateToken) ||
        _.isEmpty(fromPrincipal) ||
        _.isEmpty(toPrincipal) ||
        _.isEmpty(message)
      ) {
        return;
      }
      const sender = await User.findOne({
        where: { principal: fromPrincipal, privateToken },
      });

      if (!_.isEmpty(sender)) {
        // Check if the recipient (toPrincipal) exists in the database
        const recipientExists = await User.findOne({
          where: { principal: toPrincipal },
        });

        if (!_.isEmpty(recipientExists)) {
          // Step 1: Check if the user exists
          let existingUser = await History.findOne({
            where: {
              [Op.or]: [
                {
                  [Op.and]: [
                    { fromPrincipal: { [Op.in]: [toPrincipal] } },
                    { toPrincipal: { [Op.in]: [fromPrincipal] } },
                  ],
                },
                {
                  [Op.and]: [
                    { fromPrincipal: { [Op.in]: [fromPrincipal] } },
                    { toPrincipal: { [Op.in]: [toPrincipal] } },
                  ],
                },
              ],
            },
          });

          // Step 2: If the user exists, update the data; otherwise, create a new user
          if (existingUser) {
            history = await History.update(
              {
                fromPrincipal,
                toPrincipal,
              },
              {
                where: {
                  [Op.or]: [
                    {
                      [Op.and]: [
                        { fromPrincipal: { [Op.in]: [toPrincipal] } },
                        { toPrincipal: { [Op.in]: [fromPrincipal] } },
                      ],
                    },
                    {
                      [Op.and]: [
                        { fromPrincipal: { [Op.in]: [fromPrincipal] } },
                        { toPrincipal: { [Op.in]: [toPrincipal] } },
                      ],
                    },
                  ],
                },
                returning: true, // Return the updated record
                fields: ["fromPrincipal", "toPrincipal"],
              }
            );
          } else {
            // User does not exist, create a new user in history
            history = await History.create({
              fromPrincipal,
              toPrincipal,
              id: uuidv4(),
            });
          }


          const algo = 'aes256'
          const key = Buffer.from("6d792d7365637265742d6b65792d6b6579123489272b72d27287a2727a272738", "hex") 
          const iv = crypto.randomBytes(16)
          console.log(iv)
          const cipher = crypto.createCipheriv(algo, key, iv)
          const encrypted = cipher.update(message, 'utf-8', 'hex') + cipher.final('hex')

          const decipher = crypto.createDecipheriv(algo, key, iv)
          const decrypted = decipher.update(encrypted, 'hex', 'utf-8') + decipher.final('utf-8')

          console.log("Encrypted Message: ", encrypted)
          console.log("Decrypted Message: ", decrypted)

          // Save the message to the database
          const savedMessage = await Message.create({
            id: uuidv4(),
            fromPrincipal,
            toPrincipal,
            message: encrypted,
            iv: iv
          });

          // Send the message to the recipient
          const recipientSocket = findSocketByPrincipal(toPrincipal);
          if (recipientSocket) {
            io.to(recipientSocket.id).emit("receiveMessage", {
              fromPrincipal,
              data: savedMessage,
            });
          } else {
            console.log(
              `Recipient with principal ${toPrincipal} is not connected.`
            );
          }
        } else {
          console.log(
            `Recipient with principal ${toPrincipal} does not exist.`
          );
        }
      } else {
        console.log(`Invalid private token for principal ${fromPrincipal}`);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  });

  socket.on("disconnect", (userPrincipal) => {
    console.log(`User disconnected: ${socket.id}`);
    delete principalSocketMap[userPrincipal];
  });
});

module.exports = server;
