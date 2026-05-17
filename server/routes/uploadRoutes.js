const express = require("express");

const router = express.Router();

const multer = require("multer");

const { CloudinaryStorage } = require("multer-storage-cloudinary");

const cloudinary = require("../config/cloudinary");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "ecommerce-products",

    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const upload = multer({ storage });

// Upload Route
router.post("/", upload.single("image"), (req, res) => {
  res.send(req.file.path);
});

module.exports = router;
