const express = require("express");
const router = express.Router();
const { submitContactForm, getAllSubmissions, updateSubmission, deleteSubmission } = require("../controllers/conatactControlers");

// Middlewares
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const { contactLimit } = require("../middleware/rateLimiter");

// 1. PUBLIC: Anyone can submit a contact form (with rate limiting)
router.post("/", contactLimit, submitContactForm);

// 2. Saare contact messages dekhna (Admin only)
router.get("/", isAuthenticated, isAdmin, getAllSubmissions);

// 3. Status update karna (Admin only)
router.put("/:id", isAuthenticated, isAdmin, updateSubmission);

// 4. Purane message delete karna (Admin only)
router.delete("/:id", isAuthenticated, isAdmin, deleteSubmission);

module.exports = router;