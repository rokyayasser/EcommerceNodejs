const { check } = require("express-validator"); //instead of param or body we use check
const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getCategoryValidator = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.createCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("Category requied")
    .isLength({ min: 3 })
    .withMessage("too short category name")
    .isLength({ max: 32 })
    .withMessage("Too long category name"),
  validatorMiddleware,
];

exports.updateCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];

exports.deleteCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid category id format"),
  validatorMiddleware,
];
