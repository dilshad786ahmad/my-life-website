const express = require("express");
const router = express.Router();
const projectDetailsController = require("../controllers/projectDetailsController");
const upload = require("../middleware/uploadMiddleware");

// Image Upload Route
router.post("/upload", upload.single("image"), projectDetailsController.uploadImage);

// CRUD Routes
router.get("/:projectId", projectDetailsController.getProjectDetails);
router.post("/", projectDetailsController.upsertProjectDetails);
router.post("/review", projectDetailsController.addReview);
router.delete("/:projectId", projectDetailsController.deleteProjectDetails);

module.exports = router;
