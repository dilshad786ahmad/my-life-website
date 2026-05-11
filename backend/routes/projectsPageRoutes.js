const express = require("express");
const router = express.Router();
const { getProjectsPageContent, updateProjectsHeader, updateProjectsItems } = require("../controllers/projectsPageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getProjectsPageContent);
router.put("/header", isAuthenticated, isAdmin, updateProjectsHeader);
router.put("/items", isAuthenticated, isAdmin, updateProjectsItems);

module.exports = router;
