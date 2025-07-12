/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const factory = require("./handlersFactory");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");

exports.uploadUserImage = uploadSingleImage("profileImg"); //middleware to handle single file upload

exports.resizeImage = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();

  const filename = `user-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`uploads/users/${filename}`, (err) => {
        //Save image into DB
        req.body.profileImg = filename; //set the image field in the request body to the filename
        next();
      });
  }
});

//@desc Get list of users
//@route GET /api/v1/users
//@access Private
exports.getUsers = factory.getAll(userModel);
//@desc Get specific user by id
//@route GET /api/v1/users/:id
//@access Private
exports.getUser = factory.getOne(userModel);
//@desc Update specific user
//@route PUT /api/v1/users/:id
//@access Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      slug: req.body.slug,
      phone: req.body.phone,
      email: req.body.email,
      profileImg: req.body.profileImg, //if image is uploaded, it will be in the request body
      role: req.body.role,
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const document = await userModel.findByIdAndUpdate(
    req.params.id,
    {
      password: await bcrypt.hash(req.body.password, 12), //assuming password is in the request body
      passwordChangedAt: Date.now(), //update password changed at field
    },
    {
      new: true,
    }
  );
  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ data: document });
});
//@desc Delete specific user
//@route DELETE /api/v1/users/:id
//@access Private
exports.deleteUser = factory.deleteOne(userModel);

//@desc Create user
//@route POST /api/v1/users
//@access Private
exports.createUser = factory.createOne(userModel);
