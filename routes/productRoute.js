const express = require("express");
const {
  getProductValidation,
  createProductValidation,
  updateProductValidation,
  deleteProductValidation,
} = require("../utils/validators/productValidator");

const {
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/productController");

const router = express.Router();

router.route("/").get(getProducts).post(createProductValidation, createProduct);
router
  .route("/:id")
  .get(getProductValidation, getProduct)
  .put(updateProductValidation, updateProduct)
  .delete(deleteProductValidation, deleteProduct);

module.exports = router;
