const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 3, // 3 requests
  message: (req, res) => {
    res.status(429).json({
      success: false,
      message: "Too many attempts! Please try again after 2 minutes.",
      resetTime: req.rateLimit.resetTime
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { generalLimiter, contactLimit: generalLimiter };