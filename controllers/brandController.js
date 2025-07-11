//buisness logic (services)
const factory = require("./handlersFactory");
const brandModel = require("../models/brandModel");

//@desc Get list of brands
//@route GET /api/v1/brands
//@access Public
exports.getBrands = factory.getAll(brandModel);
//@desc Get specific brand by id
//@route GET /api/v1/brands/:id
//@access Public
exports.getBrand = factory.getOne(brandModel);
//@desc Update specific brand
//@route PUT /api/v1/brands/:id
//@access Private
exports.updateBrand = factory.updateOne(brandModel);
//@desc Delete specific brand
//@route DELETE /api/v1/brands/:id
//@access Private
exports.deleteBrand = factory.deleteOne(brandModel);

//@desc Create brand
//@route POST /api/v1/brands
//@access Private
exports.createBrand = factory.createOne(brandModel);
