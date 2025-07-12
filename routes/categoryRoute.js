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
  uploadCategoryImage,
  resizeImage: resizeCategoryImage,
} = require("../controllers/categoryController");

const AuthController = require("../controllers/authController");

const router = express.Router();
const subCategoryRoute = require("./subCategoryRoute");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
  .route("/")
  .get(getCategories)
  .post(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    createCategoryValidation,
    createCategory
  );
router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadCategoryImage,
    resizeCategoryImage,
    updateCategoryValidation,
    updateCategory
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin"),
    deleteCategoryValidation,
    deleteCategory
  );

module.exports = router;
