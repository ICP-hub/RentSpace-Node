const fs = require("fs");

module.exports = {
    deleteFileFromLocal (files) {
        if (files) {
            if (files.images) {
              files.images.forEach((file) => {
                fs.unlink(file.path, (err) => {
                  if (err)
                    console.error("Error deleting file:", file.path, err.message);
                });
              });
            }
    
            if (files.videos && files.videos.length > 0) {
              fs.unlink(files.videos[0].path, (err) => {
                if (err)
                  console.error(
                    "Error deleting file:",
                    files.videos[0].path,
                    err.message
                  );
              });
            }
          }
    }
}