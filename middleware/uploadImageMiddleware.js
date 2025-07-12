/* eslint-disable import/no-extraneous-dependencies */
const multer = require("multer");
const ApiError = require("../utils/apiError");

exports.uploadSingleImage = (fieldName) => {
  //1-DiskStorage engine
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     //category-{id}-Date.now().jpeg
  //     const ext = file.mimetype.split("/")[1]; //get the extension of the file
  //     const filename = `category-${uuidv4()}-${Date.now()}.${ext}`; //create a unique filename
  //     cb(null, filename); //callback with the filename
  //   },
  // });
  const multerStorage = multer.memoryStorage(); // Store file in memory
  const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true); // Accept the file
    } else {
      cb(new ApiError("Not an image! Please upload only images.", 401), false); // Reject the file
    }
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload.single(fieldName); // Middleware to handle single file upload
};
