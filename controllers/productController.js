/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)
const multer = require("multer");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");

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

exports.uploadProductImage = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 5 },
]); // Middleware to handle multiple file uploads

exports.resizeImage = async (req, res, next) => {
  console.log(req.files);
  //1- image processing for imageCover
  if (req.files.imageCover) {
    const imageCoverfilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/products/${imageCoverfilename}`);
    //Save image into DB
    req.body.imageCover = imageCoverfilename; //set the image field in the request body to the filename
  }
  //2- Image processing for images
  if (req.files.images) {
    req.body.images = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`uploads/products/${imageName}`);
        //Save image into DB
        req.body.images.push(imageName);
      })
    );
    next();
  }
};

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = factory.getAll(ProductModel, "Products");
//@desc Get specific Product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = factory.getOne(ProductModel, "reviews");

//@desc Update specific Product
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = factory.updateOne(ProductModel);

//@desc Delete specific Product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = factory.deleteOne(ProductModel);

//@desc Create Product
//@route POST /api/v1/products
//@access Private
exports.createProduct = factory.createOne(ProductModel);
