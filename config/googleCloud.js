const { Storage } = require('@google-cloud/storage');

// Creates a client from a Google service account key
const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: null,
  credentials: {
    client_email: process.env.CLIENT_EMAIL,
    private_key: process.env.PRIVATE_KEY,
  }
});

module.exports = storage;