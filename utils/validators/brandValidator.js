const { check, body } = require("express-validator"); //instead of param or body we use check
const slugify = require("slugify"); //to create slug from name
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
    .withMessage("Too long Brand name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateBrandValidation = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  body("name").custom((val, { req }) => {
    req.body.slug = slugify(val);
    return true;
  }),
  validatorMiddleware,
];

exports.deleteBrandValidation = [
  check("id").isMongoId().withMessage("Invalid Brand id format"),
  validatorMiddleware,
];
