const multer = require('multer');

const singleUpload = multer({ dest: 'data/uploads/' }).single('file');
const multipleUpload = multer({ dest: 'data/uploads/' }).array("files", 10);

module.exports = { singleUpload, multipleUpload };