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

const { verifyDelegation } = require("../middleware/authICPDelegation");
const { createHotelActor } = require("../middleware/createHotelActor");
const { multipleUpload } = require("../middleware/multer");

route.post(
  "/property/register",
  // verifyDelegation,
  // createHotelActor,
  // multipleUpload,
  createProperty
);
route.get("/property/filters", getPropertyFilters);
route.get("/property/all", getAllProperties);
route.delete(
  "/property/delete",
  verifyDelegation,
  createHotelActor,
  deleteProperty
);
route.put(
  "/property/update",
  verifyDelegation,
  createHotelActor,
  updateProperty
);
route.put("/property/updateAvailability", updatePropertyAvailability);
route.get("/property/likes", getLikesOnProperty);
route.put("/property/updateLikes", updateLikesOnProperty);
route.get("/property/reelData", getPropertyReelData);

module.exports = route;
