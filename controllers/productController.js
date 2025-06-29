//buisness logic (services)
const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const ProductModel = require("../models/productModel");

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = expressAsyncHandler(async (req, res) => {
  const apiFeatures = new ApiFeatures(ProductModel.find(), req.query)
    .paginate()
    .filter()
    .search()
    .sort()
    .limitFields();

  const products = await apiFeatures.mongooseQuery;

  res.status(200).json({
    results: products.length,
    data: products,
  });
});

//@desc Get specific Product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Product = await ProductModel.findById(id).populate({
    path: "category",
    select: "name -_id",
  });
  if (!Product) {
    // res.status(404).json({ msg: `No Product for this id ${id}` });
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(200).json({ data: Product });
});

//@desc Update specific Product
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }
  const Product = await ProductModel.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
  });
  if (!Product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(200).json({ data: Product });
});

//@desc Delete specific Product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = expressAsyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const Product = await ProductModel.findOneAndDelete(id);
  if (!Product) {
    return next(new ApiError(`No Product for this id ${id}`, 404));
  }
  res.status(204).send();
});

//@desc Create Product
//@route POST /api/v1/products
//@access Private
exports.createProduct = expressAsyncHandler(async (req, res) => {
  req.body.slug = slugify(req.body.title);

  const Product = await ProductModel.create(req.body);
  res.status(201).json({ data: Product });
});
