const multer = require('multer');
const path = require('path');

// Set up Multer for disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Save the uploaded file to the 'uploads' folder
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    // Give a unique name to each file using timestamps
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

module.exports = upload;
 