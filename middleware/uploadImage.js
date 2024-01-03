const multer = require("multer");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, "images/");
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "videos/");
    } else {
      cb({ error: "Mime type not supported" });
    }
  },
  filename: (res, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

module.exports = { upload };
