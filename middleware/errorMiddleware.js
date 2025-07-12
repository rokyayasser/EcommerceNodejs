/* eslint-disable no-lonely-if */
/* eslint-disable no-use-before-define */
/* eslint-disable arrow-body-style */
const ApiError = require("../utils/apiError");

const handleJwtInvalidSignature = () => {
  return new ApiError("Invalid token signature. Please log in again.", 401);
};
const handleJwtExpired = () => {
  return new ApiError("Token has expired. Please log in again.", 401);
};

const globalError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") {
      err = handleJwtInvalidSignature();
      err = handleJwtExpired();
      sendErrorForProd(err, res);
    }
  }
};

const sendErrorForDev = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorForProd = (err, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
