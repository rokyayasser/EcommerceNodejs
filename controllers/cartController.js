const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const cartModel = require("../models/cartModel");
const couponModel = require("../models/couponModel");
const productModel = require("../models/productModel");

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  delete cart.totalPriceAfterDiscount;
  return totalPrice;
};

exports.addProductToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;
  const product = await productModel.findById(productId);

  //1) Get the cart for the current user
  let cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    //create cart for logged user with product
    cart = await cartModel.create({
      user: req.user._id,
      cartItems: [{ product: productId, price: product.price }],
    });
  } else {
    if (!cart.cartItems) cart.cartItems = [];

    const productIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId
    );
    console.log(productIndex);
    if (productIndex > -1) {
      const cartItem = cart.cartItems[productIndex];
      cartItem.quantity += 1;
      cart.cartItems[productIndex] = cartItem;
    } else {
      cart.cartItems.push({ product: productId, price: product.price });
    }
  }
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }
  res.status(200).json({
    numOdCartItems: cart.cartItems.length,
    status: "success",
    data: cart,
  });
});

exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await cartModel.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ApiError("Cart not found", 404));
  }

  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.itemId
  );

  if (productIndex > -1) {
    const item = cart.cartItems[productIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
      cart.cartItems[productIndex] = item;
    } else {
      cart.cartItems.splice(productIndex, 1); // remove the item
    }
  } else {
    return next(new ApiError("Product not found in cart", 404));
  }

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: "success",
    numOdCartItems: cart.cartItems.length,
    data: cart,
  });
});

exports.clearCart = asyncHandler(async (req, res, next) => {
  await cartModel.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;
  const cart = await cartModel.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError("There is no cart for this user", 404));
  }
  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(new ApiError("Product not found in cart", 404));
  }
  calcTotalCartPrice(cart);
  await cart.save();
  res.status(200).json({
    status: "success",
    data: cart,
  });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await couponModel.findOne({
    name: req.body.coupon,
    expire: { $gt: new Date() },
  });
  if (!coupon) {
    return next(new ApiError("Coupon is invalid or expired", 404));
  }
  const cart = await cartModel.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: "success",
    data: cart,
  });
});
