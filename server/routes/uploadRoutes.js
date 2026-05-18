const express = require("express");
const router = express.Router();

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { protect, admin } = require("../middleware/authMiddleware");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "ecommerce-products",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: error.message });
        }

        res.send(result.secure_url);
      },
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
