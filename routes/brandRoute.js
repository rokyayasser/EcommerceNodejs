const express = require("express");
const {
  getBrandValidation,
  createBrandValidation,
  updateBrandValidation,
  deleteBrandValidation,
} = require("../utils/validators/brandValidator");

const {
  getBrands,
  getBrand,
  updateBrand,
  deleteBrand,
  createBrand,
} = require("../controllers/brandController");

const router = express.Router();

router.route("/").get(getBrands).post(createBrandValidation, createBrand);
router
  .route("/:id")
  .get(getBrandValidation, getBrand)
  .put(updateBrandValidation, updateBrand)
  .delete(deleteBrandValidation, deleteBrand);

module.exports = router;
