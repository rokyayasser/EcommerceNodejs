const express = require("express");

const {
  createSubCategory,
  getsubCategories,
  getsubCategory,
  deleteSubCategory,
  updateSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../controllers/subCategoryController");
const {
  createSubCategoryValidation,
  getSubCategoryValidation,
  deleteSubCategoryValidation,
  updateSubCategoryValidation,
} = require("../utils/validators/subCategoryValidator");

const AuthController = require("../controllers/authController");

//mergeParams: true allows us to access params from parent route
//ex: we need to access categoryId from parent category route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    AuthController.protect,
    setCategoryIdToBody,
    createSubCategoryValidation,
    createSubCategory
  )
  .get(createFilterObj, getsubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidation, getsubCategory)
  .put(
    AuthController.protect,
    AuthController.allowTo("admin"),
    updateSubCategoryValidation,
    updateSubCategory
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin"),
    deleteSubCategoryValidation,
    deleteSubCategory
  );

module.exports = router;
