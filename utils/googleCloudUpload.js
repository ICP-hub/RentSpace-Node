const { v4 } = require("uuid");
const storage = require("../config/googleCloud");
const stream = require("stream");

/**
 *
 * @param {bucketName} bucketName - name of the google bucket
 * @param {*} destinationFileName - file name of the uploaded image file
 * @param {*} contentType - content type(mimetype) of the uploaded image file
 * @param {*} localFilePath - file path of the uploaded image file
 * @param {*} contents raw image data base64 encoded string
 *
 * Note: localFilePath and contents only one have to be specified
 * localFilePath -upload file from uploaded files (formData)
 * contents -upload raw image data (base64 encoded string)
 */

module.exports = {
  async uploadFileToGCS(
    bucketName,
    localFilePath,
    destinationFileName,
    contentType,
    contents
  ) {
    const bucket = storage.bucket(bucketName);
    try {
      // upload image through formData file
      if (localFilePath) {
        const result = await bucket.upload(localFilePath, {
          destination: destinationFileName,
          contentType,
          gzip: true, // this will gzip the file if it's beneficial
          metadata: {
            cacheControl: "public, max-age=31536000",
          },
        });

        // console.log(result);
        console.log(
          `From '${localFilePath}' uploaded to '${bucketName}' as '${destinationFileName}'.`
        );

        return {
          url: `https://storage.googleapis.com/${bucketName}/${destinationFileName}`,
          title: destinationFileName,
        };
      }

      // upload image through raw image data (base64 encoded)
      if (contents) {
        const fileExtension = contentType.split("/")[1];
        // The new ID for your GCS file (random uuid generated)
        const destFileName = `${destinationFileName}-${v4().toString()}.${
          fileExtension || "jpg"
        }`;

        // Create a reference to a file object
        const file = bucket.file(destFileName);

        // Create a pass through stream from a string
        const passthroughStream = new stream.PassThrough();
        passthroughStream.write(
          Buffer.from(
            contents.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
            "base64"
          )
        );
        passthroughStream.end();

        async function streamFileUpload() {
          return new Promise((resolve, reject) => {
            passthroughStream
              .pipe(
                file.createWriteStream({
                  gzip: true,
                  metadata: {
                    contentType,
                    metadata: {
                      custom: "metadata",
                    },
                  },
                })
              )
              .on("finish", () => {
                resolve({
                  url: `https://storage.googleapis.com/${bucketName}/${destFileName}`,
                  title: destFileName,
                });
              })
              .on("error", (err) => {
                reject(err);
              });

            // console.log(result);
            console.log(`uploaded to '${bucketName}' as '${destFileName}'.`);
          });
        }

        return await streamFileUpload().catch(console.error);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  },

  async removeFileFromGCS(bucketName, fileName) {
    const bucket = storage.bucket(bucketName);

    // Deletes the file
    bucket
      .file(fileName)
      .delete()
      .then(() => {
        console.log(
          `File ${fileName} deleted successfully from bucket ${bucketName}.`
        );
      })
      .catch((err) => {
        // console.error('Error deleting file:', err);
        console.error(
          "Error deleting file:",
          fileName,
          "possibly not in cloud storage"
        );
      });
  },
};
