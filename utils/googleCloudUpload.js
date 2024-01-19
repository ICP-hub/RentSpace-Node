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
    destinationFileName,
    contentType,
    contents,
    fileObject,
    body
  ) {
    const bucket = storage.bucket(bucketName);
    try {
      const fileExtension = contentType.split("/")[1];
      // The new ID for your GCS file (random uuid generated)
      const destFileName = `${destinationFileName}-${v4().toString()}.${
        fileExtension || "jpg"
      }`;

      // Create a reference to a file object
      const file = bucket.file(destFileName);
      // upload image through raw image data (base64 encoded)
      if (contents) {
        // Create a pass through stream from a string
        const passthroughStream = new stream.PassThrough();
        passthroughStream.write(
          Buffer.from(
            // contents.replace(/^data:image\/(png|gif|jpeg);base64,/, ""),
            contents.replace(/^data:(image\/(?:png|gif|jpeg)|video\/(?:mp4));base64,/, ""),
            "base64"
          )
        );
        passthroughStream.end();
        return await streamFileUpload(passthroughStream).catch(console.error);
      }
      if (fileObject) {
        // console.log("fileObj : ",body?.[fileObject.fileIndex])
        try {
          const bufferStream = new stream.PassThrough();
          bufferStream.write(body?.[fileObject.fileIndex]);
          bufferStream.end();
          return await streamFileUpload(bufferStream).catch(console.error);
        } catch (error) {
          throw new Error(error);
        }
      }

      async function streamFileUpload(bufferStream) {
        return new Promise((resolve, reject) => {
          bufferStream
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
