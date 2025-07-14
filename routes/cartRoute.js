const express = require("express");

const {
  addProductToCart,
  getLoggedUserCart,
  removeSpecificCartItem,
  updateCartItemQuantity,
  clearCart,
  applyCoupon,
} = require("../controllers/cartController");
const AuthController = require("../controllers/authController");

const router = express.Router();

router.use(AuthController.protect, AuthController.allowTo("user"));

router
  .route("/")

  .post(addProductToCart)
  .get(getLoggedUserCart)
  .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router
  .route("/:itemId")
  .put(updateCartItemQuantity)
  .delete(removeSpecificCartItem);

module.exports = router;
