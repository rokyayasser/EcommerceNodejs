/* eslint-disable import/no-useless-path-segments */
const express = require("express");
const {
  getProductValidation,
  createProductValidation,
  updateProductValidation,
  deleteProductValidation,
} = require("../utils/validators/productValidator");

const AuthController = require("../controllers/authController");
const reviewRoute = require("./reviewRoute");

const {
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
  uploadProductImage,
  resizeImage: resizeProductImages,
} = require("../controllers/productController");

const router = express.Router();
//POST /products/23653535/reviews
//GET /products/23653535/reviews
//GET /products/23653535/reviews/246876866588
router.use("/:productId/reviews", reviewRoute);

router
  .route("/")
  .get(getProducts)
  .post(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadProductImage,
    resizeProductImages,
    createProductValidation,
    createProduct
  );
router
  .route("/:id")
  .get(getProductValidation, getProduct)
  .put(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadProductImage,
    resizeProductImages,
    updateProductValidation,
    updateProduct
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin"),
    deleteProductValidation,
    deleteProduct
  );

module.exports = router;
