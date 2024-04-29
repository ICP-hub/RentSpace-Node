require("dotenv").config();
const fetch = require("node-fetch-commonjs");
const crypto = require("crypto");
global.crypto = crypto.webcrypto;
global.fetch = fetch;
const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const routes = require("./routes");
_ = require("underscore");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1", routes.userRoutes);
app.use("/api/v1", routes.chatRoute);
app.use("/api/v1", routes.hotelRoutes);

module.exports = app;
const server = require("./socket/index");

server.listen(PORT, async () => {
  sequelize.sync();
  console.log(`Server is running on port ${PORT}`);
});
