const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp, resetPassword } = require("../controllers/forgotPasswordController");

// Step 1: Send OTP to email
router.post("/send-otp", sendOtp);

// Step 2: Verify OTP
router.post("/verify-otp", verifyOtp);

// Step 3: Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;
