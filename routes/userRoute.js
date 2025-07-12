const express = require("express");
const {
  getUserValidation,
  createUserValidation,
  updateUserValidation,
  deleteUserValidation,
  changeUserPasswordValidator,
} = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
  uploadUserImage,
  resizeImage,
  changeUserPassword,
} = require("../controllers/userController");

const AuthController = require("../controllers/authController");

const router = express.Router();

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);
router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword
);

router
  .route("/")
  .get(AuthController.protect, AuthController.allowTo("admin"), getUsers)
  .post(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadUserImage,
    resizeImage,
    createUserValidation,
    createUser
  );
router
  .route("/:id")
  .get(
    AuthController.protect,
    AuthController.allowTo("admin"),
    getUserValidation,
    getUser
  )
  .put(
    AuthController.protect,
    AuthController.allowTo("admin"),
    uploadUserImage,
    resizeImage,
    updateUserValidation,
    updateUser
  )
  .delete(
    AuthController.protect,
    AuthController.allowTo("admin"),
    deleteUserValidation,
    deleteUser
  );

module.exports = router;
