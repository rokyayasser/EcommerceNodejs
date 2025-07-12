const { check, body } = require("express-validator"); //instead of param or body we use check
const slugify = require("slugify"); //to create slug from name
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const reviewModel = require("../../models/reviewModel");

exports.getReviewValidation = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.createReviewValidation = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("Review ratings is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Review ratings must be between 1 and 5"),
  check("user").isMongoId().withMessage("Invalid User id format"),
  check("product")
    .isMongoId()
    .withMessage("Invalid Product id format")
    .custom(async (val, { req }) => {
      const existingReview = await reviewModel.findOne({
        user: req.user._id,
        product: val,
      });

      if (existingReview) {
        throw new Error("User has already reviewed this product");
      }

      return true;
    }),
  validatorMiddleware,
];

exports.updateReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.findById(val);
      if (!review) {
        throw new Error("Review not found");
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new Error("You are not authorized to update this review");
      }
      return true;
    }),
  validatorMiddleware,
];

exports.deleteReviewValidation = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      if (req.user.role === "user") {
        const review = await reviewModel.findById(val);
        if (!review) {
          throw new Error("Review not found");
        }
        if (review.user.toString() !== req.user._id.toString()) {
          throw new Error("You are not authorized to delete this review");
        }
        return true;
      }
    }),
  validatorMiddleware,
];
