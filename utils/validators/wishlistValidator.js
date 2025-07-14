const { check } = require("express-validator");

exports.addProductToWishlistValidation = [
  check("productId").isMongoId().withMessage("Invalid Product id format"),
];

exports.removeProductFromWishlistValidation = [
  check("productId").isMongoId().withMessage("Invalid Product id format"),
];
