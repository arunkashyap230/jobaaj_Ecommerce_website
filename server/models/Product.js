const mongoose = require("mongoose");

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Image URL or Upload Path
    image: {
      type: String,
      required: true,
      default: "/uploads/default-product.png",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    reviews: [reviewSchema],
  },
  {
    timestamps: true,
  },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
