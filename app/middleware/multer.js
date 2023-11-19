const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  ROOT_FOLDER_IMAGE_BLOG,
  ROOT_FOLDER_IMAGE_POST,
  ROOT_FOLDER_IMAGE_PRESENCE,
} = require("../utils/constants/urlBasePhoto");
// import uuid from "uuid/v4";

const storageMultiple = multer.diskStorage({
  destination: function (req, file, cb) {
    var dir = "public/images";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadMultiple = multer({
  storage: storageMultiple,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("image", 12);

// Set storage engine
const storage = multer.diskStorage({
  destination: "public/images",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  // limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("image");

// // Check file Type
function checkFileType(file, cb) {
  // Allowed ext
  const fileTypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: Images Only !!!");
  }
}

// NEWWWWWWWWWWWWWWWWWWWWWW
// Set storage engine
const storagePostSingle = multer.diskStorage({
  destination: `public/${ROOT_FOLDER_IMAGE_POST}`,
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        `${Math.floor(Math.random() * 101)}` +
        "." +
        file.originalname
    );
  },
});

const uploadPostSingle = multer({
  storage: storagePostSingle,
}).single("image");

const storageBlogSingle = multer.diskStorage({
  destination: `public/${ROOT_FOLDER_IMAGE_BLOG}`,
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        `${Math.floor(Math.random() * 101)}` +
        "." +
        file.originalname
    );
  },
});
const uploadBlogSingle = multer({
  storage: storageBlogSingle,
}).single("image");

const storagePresenceEmployee = multer.diskStorage({
  destination: `public/${ROOT_FOLDER_IMAGE_PRESENCE}`,
  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        `${Math.floor(Math.random() * 101)}` +
        "." +
        file.originalname
    );
  },
});
const uploadPresenceEmployee = multer({
  storage: storagePresenceEmployee,
}).single("image");

const uploadFileMultipleUser = multer().single("fileUser");

module.exports = {
  uploadMultiple,
  upload,
  uploadPostSingle,
  uploadBlogSingle,
  uploadPresenceEmployee,
  uploadFileMultipleUser,
};
