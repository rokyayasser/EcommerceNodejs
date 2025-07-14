const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    cartItems: {
      type: [
        {
          product: {
            type: mongoose.Schema.ObjectId,
            ref: "Product",
          },
          quantity: {
            type: Number,
            default: 1,
          },
          price: Number,
        },
      ],
      default: [], // ✅ Fix: initialize cartItems with empty array
    },
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Cart", cartSchema);
