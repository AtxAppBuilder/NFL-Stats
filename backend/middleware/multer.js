// You can store files on disk or in memory, or upload them to a cloud service like AWS S3.
// For simplicity, let’s store files on disk for now.

const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Add this to handle directory creation
const express = require("express"); // This isn’t used here, so it can be removed
const router = express.Router(); // This isn’t used here either, so it can be removed

// Configure storage
const uploadDir = path.join(__dirname, "../uploads/avatar"); // Define the upload directory
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true }); // Create the directory if it doesn’t exist
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Store files in uploads/avatar/
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter to allow only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

module.exports = upload;