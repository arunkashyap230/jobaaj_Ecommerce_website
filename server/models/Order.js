const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderItems: [
      {
        name: String,
        qty: Number,
        image: String,
        price: Number,
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    totalPrice: { type: Number, required: true, default: 0 },
    isPaid: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
