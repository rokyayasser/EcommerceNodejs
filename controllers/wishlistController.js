/* eslint-disable import/no-unresolved */
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const ApiError = require("../utils/apiError");

exports.addProductToWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: req.body.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product added to wishlist successfully",
    data: user.wishlist,
  });
});

exports.removeProductFromWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: req.params.productId },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Product removed from wishlist successfully",
    data: user.wishlist,
  });
});
