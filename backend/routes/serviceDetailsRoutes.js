const express = require("express");
const router = express.Router();
const { getServiceDetails, upsertServiceDetails, deleteServiceDetails } = require("../controllers/serviceDetailsController");
const isAuthenticated = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/:serviceId", getServiceDetails);
router.post("/:serviceId", isAuthenticated, isAdmin, upsertServiceDetails);
router.delete("/:serviceId", isAuthenticated, isAdmin, deleteServiceDetails);

module.exports = router;
