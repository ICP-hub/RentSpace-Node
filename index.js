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
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/v1", routes.userRoutes);
app.use("/api/v1", routes.chatRoute);
app.use("/api/v1", routes.hotelRoutes);
app.use("/api/v1", routes.rateHawkRoutes);
app.use("/api/v1", routes.propertyRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the homepage of RentSpace Node Server");
});

module.exports = app;
const server = require("./socket/index");

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false }); // Ensure force is set correctly
    console.log("Database & tables created!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
  console.log(`Server is running on port http://localhost:${PORT}`);
});
