const express = require("express");
const {
  addProductToWishlistValidation,
  removeProductFromWishlistValidation,
} = require("../utils/validators/wishlistValidator");

const {
  addProductToWishlist,
  removeProductFromWishlist,
} = require("../controllers/wishlistController");
const AuthController = require("../controllers/authController");

const router = express.Router();

router
  .route("/")
  .post(
    AuthController.protect,
    AuthController.allowTo("user"),
    addProductToWishlistValidation,
    addProductToWishlist
  );
router.delete(
  "/:productId",
  AuthController.protect,
  AuthController.allowTo("user"),
  removeProductFromWishlistValidation,
  removeProductFromWishlist
);

module.exports = router;
