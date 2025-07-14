const express = require("express");

const {
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  createCoupon,
} = require("../controllers/couponController");

const authService = require("../controllers/authController");

const router = express.Router();

router.use(authService.protect, authService.allowTo("admin"));

router.route("/").get(getCoupons).post(createCoupon);
router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

module.exports = router;
