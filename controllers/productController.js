//buisness logic (services)
const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = expressAsyncHandler(async (req, res) => {
  //1) Filtering
  const queryStringObj = { ...req.query }; //copying query params
  const excludedFields = ["page", "sort", "limit", "fields"];
  excludedFields.forEach((field) => delete queryStringObj[field]); //removing excluded fields from query params

  //Apply filtering using gt, gte, lt, lte, in

  const queryObj = {};
  Object.keys(queryStringObj).forEach((key) => {
    if (key.includes("[")) {
      const [field, operator] = key.split(/\[|\]/);
      if (!queryObj[field]) queryObj[field] = {};
      queryObj[field][`$${operator}`] = Number(queryStringObj[key]);
    } else {
      queryObj[key] = queryStringObj[key];
    }
  });

  console.log("Query Object:", queryObj);
  // let queryString = JSON.stringify(queryStringObj); //convert to string
  // queryString = queryString.replace(
  //   /\b(gt|gte|lt|lte|in)\b/g,
  //   (match) => `$${match}` //adding $ sign to gt, gte, lt, lte, in
  // );
  // console.log(JSON.parse(queryString));

  //2) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit; //skipping first 5 document

  // Build query
  let mongooseQuery = ProductModel.find(queryObj);

  if (req.query.sort) {
    mongooseQuery = mongooseQuery.sort(req.query.sort);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt"); // optional default
  }

  mongooseQuery = mongooseQuery
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // Execute query
  const products = await mongooseQuery;

  res.status(200).json({ results: products.length, page, data: products });
  console.log(products.map((p) => p.price));
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
