const multer = require('multer');
const path = require('path');

// Storage Engine
const storageEngine = multer.diskStorage({
    destination: './public/files',
    filename: function (req, file, callback) {
        callback(null, new Date().getTime().toString() + '-' + file.fieldname + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storageEngine,
    limits: { fileSize: 200000 },
    fileFilter: function (req, file, callback) {
        validateFile(file, callback);
    }
});

var validateFile = function (file, callback) {
    var allowedFileTypes = /\.jpeg|\.jpg|\.png|\.gif/;
    var allowedMimeTypes = /(image)\/(png|jpeg|jpg|gif)/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedMimeTypes.test(file.mimetype);
    if (extension && mimeType) {
        return callback(null, true);
    } else {
        callback("Invalid File Type.");
    }
}

module.exports = upload;