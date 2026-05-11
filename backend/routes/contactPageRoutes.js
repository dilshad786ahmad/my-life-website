const express = require("express");
const router = express.Router();

const {
    getPageContent,
    updateMainContent,
    addSolutionCard,
    updateSolutionCard,
    deleteSolutionCard,
    addContactInfoItem,
    updateContactInfoItem,
    deleteContactInfoItem
} = require("../controllers/conatcPageController");

// Middlewares
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

// ==============================
// 1. Main Page Text Routes
// ==============================
router.get("/", getPageContent);                      // Frontend par dikhane ke liye (Read)
router.put("/main-text", isAuthenticated, isAdmin, updateMainContent);          // Headings/Paragraph edit karne ke liye (Update)

// ==============================
// 2. Specialized Cards Routes
// ==============================
router.post("/cards", isAuthenticated, isAdmin, addSolutionCard);               // Naya card add karna (Create)
router.put("/cards/:cardId", isAuthenticated, isAdmin, updateSolutionCard);     // Puraane card ko edit karna (Update)
router.delete("/cards/:cardId", isAuthenticated, isAdmin, deleteSolutionCard);  // Card delete karna (Delete)

// ==============================
// 3. Contact Info Items Routes
// ==============================
router.post("/info", isAuthenticated, isAdmin, addContactInfoItem);             // Naya info item add karna (Create)
router.put("/info/:infoId", isAuthenticated, isAdmin, updateContactInfoItem);   // Puraane info item ko edit karna (Update)
router.delete("/info/:infoId", isAuthenticated, isAdmin, deleteContactInfoItem);// Info item delete karna (Delete)

module.exports = router;
