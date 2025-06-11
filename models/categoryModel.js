const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
});

//2- Create Model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
