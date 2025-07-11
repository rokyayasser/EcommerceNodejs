const factory = require("./handlersFactory");
const SubCategoryModel = require("../models/subCategoryModel");

exports.createFilterObj = (req, res, next) => {
  //Nested route
  //if we have categoryId in params, we will filter subcategories by that category
  let filterObj = {};
  if (req.params.categoryId) {
    filterObj = { category: req.params.categoryId };
  }
  req.filterObj = filterObj; //storing filterObj in request object
  next();
};
//Nested route
//GET/api/v1/cartegories/:categoryId/subcategories
//@desc Get list of subCategories
//@route GET /api/v1/subcategories
//@access Public
exports.getsubCategories = factory.getAll(SubCategoryModel);

//@desc Get specific subcategory by id
//@route GET /api/v1/subCategories/:id
//@access Public
exports.getsubCategory = factory.getOne(SubCategoryModel);

//@desc Update specific subcategory
//@route PUT /api/v1/subcategories/:id
//@access Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel);

//@desc Delete specific subcategory
//@route DELETE /api/v1/subcategories/:id
//@access Private
exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);

exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//@desc Create category
//@route POST /api/v1/subCategories
//@access Private
exports.createSubCategory = factory.createOne(SubCategoryModel);
