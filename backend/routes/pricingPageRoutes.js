const express = require("express");
const router = express.Router();
const {
    getPageContent,
    updateHeader,
    addBasicPlan,
    updateBasicPlan,
    deleteBasicPlan,
    addStandardSolution,
    updateStandardSolution,
    deleteStandardSolution,
    addEnterpriseSystem,
    updateEnterpriseSystem,
    deleteEnterpriseSystem
} = require("../controllers/pricingPageController");

const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

// Public Route
router.get("/", getPageContent);

// Admin Routes for Header
router.put("/header", isAuthenticated, isAdmin, updateHeader);

// Admin Routes for Basic Plans
router.post("/basic", isAuthenticated, isAdmin, addBasicPlan);
router.put("/basic/:planId", isAuthenticated, isAdmin, updateBasicPlan);
router.delete("/basic/:planId", isAuthenticated, isAdmin, deleteBasicPlan);

// Admin Routes for Standard Solutions
router.post("/standard", isAuthenticated, isAdmin, addStandardSolution);
router.put("/standard/:solutionId", isAuthenticated, isAdmin, updateStandardSolution);
router.delete("/standard/:solutionId", isAuthenticated, isAdmin, deleteStandardSolution);

// Admin Routes for Enterprise Systems
router.post("/enterprise", isAuthenticated, isAdmin, addEnterpriseSystem);
router.put("/enterprise/:systemId", isAuthenticated, isAdmin, updateEnterpriseSystem);
router.delete("/enterprise/:systemId", isAuthenticated, isAdmin, deleteEnterpriseSystem);

module.exports = router;
