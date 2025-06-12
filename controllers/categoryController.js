//buisness logic (services)
const slugify = require("slugify");
const CategoryModel = require("../models/categoryModel");
const expressAsyncHandler = require("express-async-handler");

exports.getCategories = (req, res) => {
  //   const name = req.body.name;
  //   console.log(name);
  //   //adding to database
  //   const newCategory = new CategoryModel({ name });
  //   newCategory
  //     .save()
  //     .then((doc) => {
  //       res.json(doc);
  //     })
  //     .catch((err) => {
  //       res.json(err);
  //     });
  res.send();
};
//@des create
exports.createCategory = expressAsyncHandler(async (req, res) => {
  const name = req.body.name;
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
  // const name = req.body.name;
  // CategoryModel.create({ name, slug: slugify(name) })
  //   .then((category) => res.status(201).json({ data: category }))
  //   .catch((err) => res.status(400).send(err));
});
