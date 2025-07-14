const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Coupon name is required"],
      unique: [true, "Coupon name must be unique"],
      trim: true,
    },
    discount: {
      type: Number,
      required: [true, "Discount percentage is required"],
    },
    expire: {
      type: Date,
      required: [true, "Expiry date is required"],
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

module.exports = mongoose.model("Coupon", couponSchema);
