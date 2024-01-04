const multer = require('multer');

const singleUpload = multer().single('file');
const multipleUpload = multer().array("files", 10);

module.exports = { singleUpload, multipleUpload };