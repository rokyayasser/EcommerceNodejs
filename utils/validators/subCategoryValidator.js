const { check, body } = require("express-validator"); //instead of param or body we use check
const slugify = require("slugify"); //to create slug from name

const validatorMiddleware = require("../../middleware/validatorMiddleware");

exports.getSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];

exports.createSubCategoryValidation = [
  check("name")
    .notEmpty()
    .withMessage("SubCategory requied")
    .isLength({ min: 2 })
    .withMessage("too short SubCategory name")
    .isLength({ max: 32 })
    .withMessage("Too long SubCategory name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("subCategory must belong to category")
    .isMongoId()
    .withMessage("Invalid category id format"),

  validatorMiddleware,
];

exports.updateSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteSubCategoryValidation = [
  check("id").isMongoId().withMessage("Invalid SubCategory id format"),
  validatorMiddleware,
];
