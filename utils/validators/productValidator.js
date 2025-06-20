const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const CategoryModel = require("../../models/categoryModel");
const SubCategoryModel = require("../../models/subCategoryModel");

exports.createProductValidation = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("Too short product title")
    .notEmpty()
    .withMessage("Product title is required"),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 20000 })
    .withMessage("Too long product description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold").optional().isNumeric().withMessage("Sold must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 2000 })
    .withMessage("Too long product price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()

    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("Price after discount must be less than price");
      }
      return true;
    }),
  check("colors")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings"),
  check("imageCover").notEmpty().withMessage("Product cover image is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("Images must be an array of strings"),
  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .isMongoId()
    .withMessage("Invalid ID format for category")
    .custom((categoryId) =>
      CategoryModel.findById(categoryId).then((cat) => {
        if (!cat) {
          return Promise.reject(
            new Error(`No category found with ID: ${categoryId}`)
          );
        }
        return true;
      })
    ),
  check("subCategories")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format for subcategory")
    .custom((subCategoriesIds) =>
      SubCategoryModel.find({
        _id: { $exists: true, $in: subCategoriesIds },
      }).then((result) => {
        if (result.length < 1 || result.length !== subCategoriesIds.length) {
          return Promise.reject(new Error("Some subcategories do not exist"));
        }
        console.log(result.length);
      })
    )
    .custom((val, { req }) =>
      SubCategoryModel.find({ category: req.body.category }).then(
        (subCategories) => {
          const subCategoriesIdsInDB = [];
          subCategories.forEach((subCategory) => {
            subCategoriesIdsInDB.push(subCategory._id.toString());
          });
          console.log(subCategoriesIdsInDB);
          // const checker = val.every((v) => subCategoriesIdsInDB.includes(v));
          // console.log(checker);

          // check if all subcategories ids in db include subCategories in req.body
          if (!val.every((v) => subCategoriesIdsInDB.includes(v))) {
            return Promise.reject(
              new Error("Some subcategories do not belong to this category")
            );
          }
        }
      )
    ),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID format for brand"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("Ratings average must be a number")
    .isLength({ min: 1 })
    .withMessage("Ratings average must be above or equal 1")
    .isLength({ max: 5 })
    .withMessage("Ratings average must be below or equal 5"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("Ratings quantity must be a number"),

  validatorMiddleware,
];

exports.getProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.updateProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];

exports.deleteProductValidation = [
  check("id").isMongoId().withMessage("Invalid Product id format"),
  validatorMiddleware,
];
