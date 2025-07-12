/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const brandModel = require("../models/brandModel");
const ApiError = require("../utils/apiError");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadBrandImage = uploadSingleImage("image"); //middleware to handle single file upload

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/brands/${filename}`, (err) => {
      //Save image into DB
      req.body.image = filename; //set the image field in the request body to the filename
      next();
    });
});

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands = factory.getAll(brandModel);
//@desc Get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public
exports.getBrand = factory.getOne(brandModel);
//@desc Update specific brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = factory.updateOne(brandModel);
//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = factory.deleteOne(brandModel);

//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = factory.createOne(brandModel);
