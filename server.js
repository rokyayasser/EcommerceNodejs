const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");

//Importing routes
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const brandRoute = require("./routes/brandRoute");
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const reviewRoute = require("./routes/reviewRoute");

//Connect with db
dbConnection();

//express app
const app = express();

//middleware before routes (use with middlewares)
app.use(express.json()); //parsing encoded string into js obj
app.use(express.static(path.join(__dirname, "uploads"))); //parsing urlencoded data

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/subCategories", subCategoryRoute);
app.use("/api/v1/brands", brandRoute);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/reviews", reviewRoute);

//Create error and send it to error handling middleware
app.all("/*any", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling middleware
app.use(globalError);

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

//listening on unhandled rejection outside the express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandleRejection Errors: ${err.name} |${err.message}`);

  server.close(() => {
    console.error("Shutting down.....");
    process.exit(1);
  });
});
