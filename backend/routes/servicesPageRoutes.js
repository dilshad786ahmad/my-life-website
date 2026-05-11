const express = require("express");
const router = express.Router();
const { getServicesPageContent, updateServicesHeader, updateServicesCards } = require("../controllers/servicesPageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getServicesPageContent);
router.put("/header", isAuthenticated, isAdmin, updateServicesHeader);
router.put("/cards", isAuthenticated, isAdmin, updateServicesCards);

module.exports = router;
