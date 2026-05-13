const express = require("express");
const router = express.Router();

const { signup, signin , logout, checkAdminExists, sendSignupOtp, getMe } = require("../controllers/authControllers.js");
const { googleSignIn } = require("../controllers/googleAuthController.js");
const isAuthenticated = require("../middleware/authMiddleware.js");
const { generalLimiter } = require("../middleware/rateLimiter.js");

//  autothetication routes

router.post("/send-signup-otp", generalLimiter, sendSignupOtp);
router.post("/signup", generalLimiter, signup);
router.post("/signin", generalLimiter, signin);
router.get("/check-admin", checkAdminExists);
router.get("/me", getMe);
router.post("/logout", generalLimiter, logout);

// ✅ Google OAuth route
router.post("/google", googleSignIn);

module.exports = router;