/* eslint-disable import/no-extraneous-dependencies */
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const ApiError = require("../utils/apiError");

const userModel = require("../models/userModel");

const createToken = (payload) =>
  jwt.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: "90d",
  });

//@desc: Sign up a new user
//@route: POST /api/v1/auth/signup
//@access: Public
exports.signup = asyncHandler(async (req, res, next) => {
  //1- create user
  const user = await userModel.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  //2- create token
  const token = createToken(user._id);
  res.status(201).json({
    data: user,
    token,
  });
});
//@desc: login a user
//@route: POST /api/v1/auth/login
//@access: Public
exports.login = asyncHandler(async (req, res, next) => {
  //1- check if email and password are provided
  //2- check if user exists with that email and check password is correct
  const user = await userModel.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 401));
  }
  //3- create token
  const token = createToken(user._id);
  //4- send response
  res.status(200).json({
    data: user,
    token,
  });
});

exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new ApiError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // ✅ Use promisified jwt.verify
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  const user = await userModel.findById(decoded.userId); // ✅ await added
  if (!user) {
    return next(new ApiError("User no longer exists.", 401));
  }

  if (user.passwordChangedAt) {
    const passwordChangedTimestamp = parseInt(
      user.passwordChangedAt.getTime() / 1000,
      10
    );
    if (passwordChangedTimestamp > decoded.iat) {
      return next(
        new ApiError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }
  }

  req.user = user;
  next();
});

exports.allowTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    //1- check if user has the required role
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
