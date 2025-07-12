const express = require("express");
const {
  signupValidation,
  loginValidation,
} = require("../utils/validators/authValidator");

const { signup, login } = require("../controllers/authController");

const router = express.Router();

router.route("/signup").post(signupValidation, signup);
router.route("/login").post(loginValidation, login);

//   .route("/:id")
//   .get(getUserValidation, getUser)
//   .put(uploadUserImage, resizeImage, updateUserValidation, updateUser)
//   .delete(deleteUserValidation, deleteUser);

module.exports = router;
