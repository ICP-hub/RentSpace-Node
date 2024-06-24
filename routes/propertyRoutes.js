const route = require("express").Router();

const {
  createProperty,
  getPropertyFilters,
  getAllProperties,
  deleteProperty,
  updateProperty,
  updatePropertyAvailability,
  getLikesOnProperty,
  updateLikesOnProperty,
  getPropertyReelData,
} = require("../controller/propertyController");

route.post("/property/register", createProperty);
route.get("/property/filters", getPropertyFilters);
route.get("/property/all", getAllProperties);
route.delete("/property/delete", deleteProperty);
route.put("/property/update", updateProperty);
route.put("/property/updateAvailability", updatePropertyAvailability);
route.get("/property/likes", getLikesOnProperty);
route.put("/property/updateLikes", updateLikesOnProperty);
route.get("/property/reelData", getPropertyReelData);

module.exports = route;
