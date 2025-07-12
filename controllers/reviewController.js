/* eslint-disable import/no-extraneous-dependencies */
//buisness logic (services)

const reviewModel = require("../models/reviewModel");
const factory = require("./handlersFactory");

exports.createFilterObj = (req, res, next) => {
  //Nested route
  //GET /api/v1/products/:productId/reviews
  //if we have productId in params, we will filter reviews by that product
  let filterObj = {};
  if (req.params.productId) {
    filterObj = { product: req.params.productId };
  }
  req.filterObj = filterObj; //storing filterObj in request object
  next();
};

//@desc Get list of reviews
//@route GET /api/v1/reviews
//@access Public
exports.getReviews = factory.getAll(reviewModel);
//@desc Get specific review by id
//@route GET /api/v1/reviews/:id
//@access Public
exports.getReview = factory.getOne(reviewModel);

//Nested route
exports.setProductIdAndUserIdToBody = (req, res, next) => {
  //Nested route
  if (!req.body.product) req.body.product = req.params.productId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};
//@desc Update specific review
//@route PUT /api/v1/reviews/:id
//@access Private/Protect/User
exports.updateReview = factory.updateOne(reviewModel);
//@desc Delete specific review
//@route DELETE /api/v1/reviews/:id
//@access Private/Protect/User-Admin
exports.deleteReview = factory.deleteOne(reviewModel);

//@desc Create review
//@route POST /api/v1/reviews
//@access Private/Protect/User
exports.createReview = factory.createOne(reviewModel);
