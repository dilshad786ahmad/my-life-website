const express = require("express");
const router = express.Router();
const { getHomePageContent, updateHomeHero, updateHomeCards } = require("../controllers/homePageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getHomePageContent);
router.put("/hero", isAuthenticated, isAdmin, updateHomeHero);
router.put("/cards", isAuthenticated, isAdmin, updateHomeCards);
router.put("/social", isAuthenticated, isAdmin, require("../controllers/homePageController").updateSocialLinks);

module.exports = router;
