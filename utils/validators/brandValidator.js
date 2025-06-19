const { check } = require("express-validator"); //instead of param or body we use check
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getBrandValidation = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.createBrandValidation = [
  check("name")
    .notEmpty()
    .withMessage("Brand requied")
    .isLength({ min: 3 })
    .withMessage("too short Brand name")
    .isLength({ max: 32 })
    .withMessage("Too long Brand name"),
  validatorMiddleware,
];

exports.updateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];

exports.deleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
