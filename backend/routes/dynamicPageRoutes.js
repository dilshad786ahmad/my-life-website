const express = require("express");
const router = express.Router();
const { getPageBySlug } = require("../controllers/dynamicPageController");

// Public Route to get page by slug (e.g. /api/pages/get-started)
router.get("/:slug", getPageBySlug);

module.exports = router;
