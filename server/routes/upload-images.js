const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const uploadImagesRouter = express.Router();

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Validate Cloudinary configuration
const missingConfig = [];
if (!cloudinaryConfig.cloud_name) missingConfig.push("CLOUDINARY_CLOUD_NAME");
if (!cloudinaryConfig.api_key) missingConfig.push("CLOUDINARY_API_KEY");
if (!cloudinaryConfig.api_secret) missingConfig.push("CLOUDINARY_API_SECRET");

if (missingConfig.length > 0) {
  console.warn(`⚠️  Cloudinary configuration incomplete. Missing: ${missingConfig.join(", ")}`);
  console.warn("Image uploads will fail until Cloudinary is properly configured.");
} else {
  cloudinary.config(cloudinaryConfig);
  console.log("✅ Cloudinary configured successfully");
}

// Multer per leggere file in memoria
const upload = multer({ storage: multer.memoryStorage() });

uploadImagesRouter.post("/images", upload.single("file"), async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (missingConfig.length > 0) {
      return res.status(500).json({ 
        error: "Cloudinary not configured", 
        details: `Missing: ${missingConfig.join(", ")}` 
      });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: "Invalid file type", 
        details: `Allowed types: ${allowedTypes.join(", ")}` 
      });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: "File too large", 
        details: `Maximum size: 10MB` 
      });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { 
          folder: "email-assets",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(file.buffer);
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ 
      error: "Upload failed", 
      details: err.message || "Unknown error" 
    });
  }
});

module.exports = uploadImagesRouter;
