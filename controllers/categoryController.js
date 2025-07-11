//buisness logic (services)

const factory = require("./handlersFactory");
const CategoryModel = require("../models/categoryModel");

//@desc Get list of categories
//@route GET /api/v1/categories
//@access Public
exports.getCategories = factory.getAll(CategoryModel);

//@desc Get specific category by id
//@route GET /api/v1/categories/:id
//@access Public
exports.getCategory = factory.getOne(CategoryModel);
//@desc Update specific category
//@route PUT /api/v1/categories/:id
//@access Private
exports.updateCategory = factory.updateOne(CategoryModel);

//@desc Delete specific category
//@route DELETE /api/v1/categories/:id
//@access Private
exports.deleteCategory = factory.deleteOne(CategoryModel);

//@desc Create category
//@route POST /api/v1/categories
//@access Private
exports.createCategory = factory.createOne(CategoryModel);
