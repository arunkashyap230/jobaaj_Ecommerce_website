const Product = require("../models/Product");

const normalizeRating = (value, fallback = 0) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  const rating = Number.parseFloat(String(value).replace(",", "."));

  if (Number.isNaN(rating)) {
    return fallback;
  }

  return Math.min(5, Math.max(0, rating));
};

// Get all products (with search, filter & sort)
const getProducts = async (req, res) => {
  try {
    const searchTerm = req.query.keyword || req.query.search || "";
    const keyword = searchTerm
      ? { name: { $regex: searchTerm, $options: "i" } }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const sortOptions = {
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
    };

    const sort = sortOptions[req.query.sort] || { createdAt: -1 };

    const products = await Product.find({ ...keyword, ...category }).sort(sort);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product (admin)
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      category,
      countInStock,
      rating = 0,
    } = req.body;
    const product = new Product({
      name,
      price,
      description,
      image,
      category,
      countInStock,
      rating: normalizeRating(rating),
    });
    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      product.description = req.body.description ?? product.description;
      product.image = req.body.image ?? product.image;
      product.category = req.body.category ?? product.category;
      product.countInStock = req.body.countInStock ?? product.countInStock;
      product.rating = normalizeRating(req.body.rating, product.rating);

      const updated = await product.save();
      res.json(updated);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add review
const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
      };
      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ message: "Review added" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
};
