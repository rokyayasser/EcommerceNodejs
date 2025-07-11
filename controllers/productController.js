//buisness logic (services)
const factory = require("./handlersFactory");
const ProductModel = require("../models/productModel");

//@desc Get list of products
//@route GET /api/v1/products
//@access Public
exports.getProducts = factory.getAll(ProductModel, "Products");
//@desc Get specific Product by id
//@route GET /api/v1/products/:id
//@access Public
exports.getProduct = factory.getOne(ProductModel);

//@desc Update specific Product
//@route PUT /api/v1/products/:id
//@access Private
exports.updateProduct = factory.updateOne(ProductModel);

//@desc Delete specific Product
//@route DELETE /api/v1/products/:id
//@access Private
exports.deleteProduct = factory.deleteOne(ProductModel);

//@desc Create Product
//@route POST /api/v1/products
//@access Private
exports.createProduct = factory.createOne(ProductModel);
