// main index .js
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
const fs = require("fs");
const path = require("path");
const https = require("https");
const { updateBooking } = require("./controller/checkOutController");

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
app.use("/api/v1", routes.stripeRoutes);
app.use("/api/v1", routes.checkOutRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the homepage of RentSpace Node Server");
});

// download the ratehawk hotels Dump file every 7 days
const fileUrl =
  "https://partner-feedora.s3.eu-central-1.amazonaws.com/feed/partner_feed_en_v3.jsonl.zst";
const fileName = "partner_feed_en_v3.jsonl.zst";
const filePath = path.join(__dirname, "controller", fileName);

function downloadFile(url, path) {
  const file = fs.createWriteStream(path);
  https
    .get(url, (response) => {
      response.pipe(file);
      console.log("Downloading file...");
      console.log(fileUrl);
      file.on("finish", () => {
        file.close(() => {
          console.log(`File downloaded and saved to ${filePath}`);
        });
      });
    })
    .on("error", (error) => {
      fs.unlink(path);
      console.error(`Error downloading file: ${error.message}`);
    });
}

function inititate_download() {
  setInterval(() => {
    downloadFile(fileUrl, filePath);
  }, 7 * 24 * 60 * 60 * 1000); // 7 days

  console.log("Scheduled file download job to run every 7 Days.");
}

// room update every 5 seconds

setInterval(() => {
  updateBooking();
}, 60 * 1000); // 5 seconds

module.exports = app;
const server = require("./socket/index");

server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    await sequelize.sync({ force: false }); // Ensure force is set correctly
    console.log("Database & tables created!");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
  inititate_download();
  console.log(`Server is running on port http://localhost:${PORT}`);
});
