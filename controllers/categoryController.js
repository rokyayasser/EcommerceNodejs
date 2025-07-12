/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");
const ApiError = require("../utils/apiError");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadCategoryImage = uploadSingleImage("image"); //middleware to handle single file upload

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/categories/${filename}`, (err) => {
        if (err) return next(new ApiError("Error processing image", 500));

        //Save image into DB
        req.body.image = filename; //set the image field in the request body to the filename
        next();
      });
  }
});

//@desc Get list of categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = factory.getAll(CategoryModel);

//@desc Get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = factory.getOne(CategoryModel);
//@desc Update specific category
//@route PUT /api/v1/categories/:id
//@access Private
exports.updateCategory = factory.updateOne(CategoryModel);

//@desc Delete specific category
//@route DELETE /api/v1/categories/:id
//@access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);

//@desc Create category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = factory.createOne(CategoryModel);
