/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)
const factory = require("./handlersFactory");
const couponModel = require("../models/couponModel");
const ApiError = require("../utils/apiError");

//@desc Get list of coupons
//@route GET /api/v1/coupons
//@access Private/Admin
exports.getCoupons = factory.getAll(couponModel);
//@desc Get specific coupon by id
//@route GET /api/v1/coupons/:id
//@access Private/Admin
exports.getCoupon = factory.getOne(couponModel);
//@desc Update specific coupon
//@route PUT /api/v1/coupons/:id
//@access Private/Admin
exports.updateCoupon = factory.updateOne(couponModel);
//@desc Delete specific coupon
//@route DELETE /api/v1/coupons/:id
//@access Private/Admin
exports.deleteCoupon = factory.deleteOne(couponModel);

//@desc Create coupon
//@route POST /api/v1/coupons
//@access Private/Admin
exports.createCoupon = factory.createOne(couponModel);
