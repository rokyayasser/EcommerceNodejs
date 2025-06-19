const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
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
exports.getsubCategories = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; //skipping first 5 document
  console.log(req.params);

  const subCategories = await SubCategoryModel.find(req.filterObj)
    .skip(skip)
    .limit(limit);
  res
    .status(200)
    .json({ results: subCategories.length, page, data: subCategories });
});

//@desc Get specific subcategory by id
//@route GET /api/v1/subCategories/:id
//@access Public
exports.getsubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findById(id);
  if (!subcategory) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

//@desc Update specific subcategory
//@route PUT /api/v1/subcategories/:id
//@access Private
exports.updateSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, category } = req.body;
  const subcategory = await SubCategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name), category },
    { new: true }
  );
  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(200).json({ data: subcategory });
});

//@desc Delete specific subcategory
//@route DELETE /api/v1/subcategories/:id
//@access Private
exports.deleteSubCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const subcategory = await SubCategoryModel.findOneAndDelete(id);
  if (!subcategory) {
    return next(new ApiError(`No subcategory for this id ${id}`, 404));
  }
  res.status(204).send();
});
exports.setCategoryIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

//@desc Create category
//@route POST /api/v1/subCategories
//@access Private
exports.createSubCategory = expressAsyncHandler(async (req, res) => {
  //Nested route
  const { name, category } = req.body;
  const subCategory = await SubCategoryModel.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});
