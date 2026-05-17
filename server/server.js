require("dotenv").config();

// Main server file

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Connect Database
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json());

// Static Upload Folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Default Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/products", productRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/users", userRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api/payment", paymentRoutes);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
