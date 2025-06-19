//buisness logic (services)
const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const brandModel = require("../models/brandModel");

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands = expressAsyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit; //skipping first 5 document
  const brands = await brandModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: brands.length, page, data: brands });
});

//@desc Get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public
exports.getBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findById(id);
  if (!brand) {
    // res.status(404).json({ msg: `No brand for this id ${id}` });
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

//@desc Update specific brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const brand = await brandModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await brandModel.findOneAndDelete(id);
  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(204).send();
});

//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = expressAsyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await brandModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});
