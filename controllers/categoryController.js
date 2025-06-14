//buisness logic (services)
const slugify = require("slugify");
const ApiError = require("../utils/apiError");
const CategoryModel = require("../models/categoryModel");
const expressAsyncHandler = require("express-async-handler");

//@desc Get list of categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; //skipping first 5 document
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

//@desc Get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);
  if (!category) {
    // res.status(404).json({ msg: `No category for this id ${id}` });
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

//@desc Update specific category
//@route PUT /api/v1/categories/:id
//@access Private
exports.updateCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(200).json({ data: category });
});

//@desc Delete specific category
//@route DELETE /api/v1/categories/:id
//@access Private
exports.deleteCategory = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await CategoryModel.findOneAndDelete(id);
  if (!category) {
    return next(new ApiError(`No category for this id ${id}`, 404));
  }
  res.status(204).send();
});

//@desc Create category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = expressAsyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});
