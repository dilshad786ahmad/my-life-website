const express = require("express");
const router = express.Router();
const { getAboutPageContent, updateHeroSection, updateStats, updateImages, uploadResume, uploadImage } = require("../controllers/aboutPageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const upload = require("../middleware/uploadMiddleware");

// Public route
router.get("/", getAboutPageContent);

// Admin routes
router.put("/hero", isAuthenticated, isAdmin, updateHeroSection);
router.put("/stats", isAuthenticated, isAdmin, updateStats);
router.put("/images", isAuthenticated, isAdmin, updateImages);
router.post("/upload-resume", isAuthenticated, isAdmin, upload.single("resume"), uploadResume);
router.post("/upload-image", isAuthenticated, isAdmin, upload.single("image"), uploadImage);

module.exports = router;
