//buisness logic (services)
const slugify = require("slugify");
const expressAsyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ProductModel = require("../models/productModel");

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = expressAsyncHandler(async (req, res) => {
  const queryStringObj = { ...req.query };
  const excludedFields = ["page", "sort", "limit", "fields", "keyword"];
  excludedFields.forEach((field) => delete queryStringObj[field]);

  // 1) Filtering
  const filterConditions = [];
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
  filterConditions.push(queryObj);

  // 2) Searching
  if (req.query.keyword) {
    filterConditions.push({
      $or: [
        { title: { $regex: req.query.keyword, $options: "i" } },
        { description: { $regex: req.query.keyword, $options: "i" } },
      ],
    });
  }

  // Build query object
  const finalQueryObj =
    filterConditions.length > 1
      ? { $and: filterConditions }
      : filterConditions[0];

  let mongooseQuery = ProductModel.find(finalQueryObj);

  // 3) Sorting
  if (req.query.sort) {
    const sortFields = req.query.sort.split(",").join(" ");
    mongooseQuery = mongooseQuery.sort(sortFields);
  } else {
    mongooseQuery = mongooseQuery.sort("-createdAt");
  }

  // 4) Field limiting
  if (req.query.fields) {
    const fields = req.query.fields.split(",").join(" ");
    mongooseQuery = mongooseQuery.select(fields);
  } else {
    mongooseQuery = mongooseQuery.select("-__v");
  }

  // 5) Pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;
  mongooseQuery = mongooseQuery
    .skip(skip)
    .limit(limit)
    .populate({ path: "category", select: "name -_id" });

  // 6) Execute
  const products = await mongooseQuery;

  res.status(200).json({
    results: products.length,
    page,
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
