const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const { expr } = require("jquery");
dotenv.config({ path: "config.env" });
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});
