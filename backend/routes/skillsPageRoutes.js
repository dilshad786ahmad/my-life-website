const express = require("express");
const router = express.Router();
const { getSkillsPageContent, updateSkillsHeader, updateTechSkills, updateSoftSkills, updateSkillsMisc } = require("../controllers/skillsPageController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/", getSkillsPageContent);
router.put("/header", isAuthenticated, isAdmin, updateSkillsHeader);
router.put("/tech", isAuthenticated, isAdmin, updateTechSkills);
router.put("/soft", isAuthenticated, isAdmin, updateSoftSkills);
router.put("/misc", isAuthenticated, isAdmin, updateSkillsMisc);

module.exports = router;
