const express = require("express");
const router = express.Router();
const {
  createOrUpdateFeedback,
  getMyFeedback,
  getPublicFeedbacks,
  adminGetAllFeedbacks,
  adminUpdateFeedback,
  adminDeleteFeedback,
  clientDeleteFeedback,
} = require("../controllers/clientFeedbackController");

const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

// --- PUBLIC ROUTES ---
router.get("/public", getPublicFeedbacks);

// --- CLIENT ROUTES (Requires Auth) ---
// Get own feedback
router.get("/me", isAuthenticated, getMyFeedback);
// Create or update own feedback
router.post("/", isAuthenticated, createOrUpdateFeedback);
// Client deletes own feedback
router.delete("/me", isAuthenticated, clientDeleteFeedback);

// --- ADMIN ROUTES (Requires Auth + Admin) ---
router.get("/admin", isAuthenticated, isAdmin, adminGetAllFeedbacks);
router.put("/admin/:id", isAuthenticated, isAdmin, adminUpdateFeedback);
router.delete("/admin/:id", isAuthenticated, isAdmin, adminDeleteFeedback);

module.exports = router;
