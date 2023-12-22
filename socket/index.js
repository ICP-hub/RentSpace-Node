const http = require("http");
const socketIO = require("socket.io");
const { v4: uuidv4 } = require("uuid");
const { Message } = require("../models/Message");
const { User } = require("../models/User");
const app = require("../index");
const { findSocketByPrincipal } = require("./helpers/findSocket");
const History = require("../models/History");
const server = http.createServer(app);
const io = socketIO(server);

principalSocketMap = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  const userPrincipal = socket.principal;
  principalSocketMap[userPrincipal] = socket.id;

  socket.on("sendMessage", async (data) => {
    try {
      const { fromPrincipal, toPrincipal, message, privateToken } =
        JSON.parse(data);
      const sender = await User.findOne({
        where: { principal: fromPrincipal, privateToken },
      });

      if (sender) {
        // Check if the recipient (toPrincipal) exists in the database
        const recipientExists = await User.findOne({
          where: { principal: toPrincipal },
        });

        if (recipientExists) {
          let history = await History.findOrCreate({
            where: {
              fromPrincipal,
              toPrincipal,
            },
            defaults: {
              fromPrincipal,
              toPrincipal,
              id: uuidv4(),
            },
          });

          // Save the message to the database
          const savedMessage = await Message.create({
            id: uuidv4(),
            fromPrincipal,
            toPrincipal,
            message,
          });

          // Send the message to the recipient
          const recipientSocket = findSocketByPrincipal(toPrincipal);
          if (recipientSocket) {
            io.to(recipientSocket.id).emit("receiveMessage", {
              fromPrincipal,
              data: {
                id: uuidv4(),
                fromPrincipal,
                toPrincipal,
                message,
              },
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

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete principalSocketMap[userPrincipal];
  });
});

module.exports = server;
