const express = require("express");
const {
  getReviewValidation,
  createReviewValidation,
  updateReviewValidation,
  deleteReviewValidation,
} = require("../utils/validators/reviewValidator");
// const {
//   getBrandValidation,
//   createBrandValidation,
//   updateBrandValidation,
//   deleteBrandValidation,
// } = require("../utils/validators/brandValidator");

const {
  getReviews,
  getReview,
  updateReview,
  deleteReview,

  createReview,
  createFilterObj,
  setProductIdAndUserIdToBody,
} = require("../controllers/reviewController");

const AuthController = require("../controllers/authController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(createFilterObj, getReviews)
  .post(
    AuthController.protect,
    AuthController.allowTo("user"),
    setProductIdAndUserIdToBody,
    createReviewValidation,
    createReview
  );
router
  .route("/:id")
  .get(getReviewValidation, getReview)
  .put(
    AuthController.protect,
    AuthController.allowTo("user"),
    updateReviewValidation,
    updateReview
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin", "user"),
    deleteReviewValidation,
    deleteReview
  );

module.exports = router;
