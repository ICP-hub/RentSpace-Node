const express = require("express");
const sequelize = require("./database");
const routes = require("./routes");
_ = require("underscore");

const app = express();
const PORT = process.env.PORT || 4040;

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
