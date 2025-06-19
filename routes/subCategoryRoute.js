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

//mergeParams: true allows us to access params from parent route
//ex: we need to access categoryId from parent category route
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidation, createSubCategory)
  .get(createFilterObj, getsubCategories);
router
  .route("/:id")
  .get(getSubCategoryValidation, getsubCategory)
  .put(updateSubCategoryValidation, updateSubCategory)
  .delete(deleteSubCategoryValidation, deleteSubCategory);

module.exports = router;
