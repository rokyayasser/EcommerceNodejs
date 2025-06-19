const express = require("express");
const {
  getCategoryValidator,
  createCategoryValidation,
  updateCategoryValidation,
  deleteCategoryValidation,
} = require("../utils/validators/categoryValidator");

const {
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory,
} = require("../controllers/categoryController");

const router = express.Router();
const subCategoryRoute = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidation, createCategory);
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(updateCategoryValidation, updateCategory)
  .delete(deleteCategoryValidation, deleteCategory);

module.exports = router;
