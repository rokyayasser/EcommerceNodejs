const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middleware/errorMiddleware");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");

//Connect with db
dbConnection();

//express app
const app = express();

//middleware before routes (use with middlewares)
app.use(express.json()); //parsing encoded string into js obj

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

//Mount Routes
app.use("/api/v1/categories", categoryRoute);

//Create error and send it to error handling middleware
app.all("/*any", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

//Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT;
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
