const express = require("express");
const {
  getBrandValidation,
  createBrandValidation,
  updateBrandValidation,
  deleteBrandValidation,
} = require("../utils/validators/brandValidator");

const AuthController = require("../controllers/authController");

const {
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  createBrand,
  uploadBrandImage,
  resizeImage,
} = require("../controllers/brandController");

const router = express.Router();

router
  .route("/")
  .get(getBrands)
  .post(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadBrandImage,
    resizeImage,
    createBrandValidation,
    createBrand
  );
router
  .route("/:id")
  .get(getBrandValidation, getBrand)
  .put(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidation,
    updateBrand
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin"),
    deleteBrandValidation,
    deleteBrand
  );

module.exports = router;
