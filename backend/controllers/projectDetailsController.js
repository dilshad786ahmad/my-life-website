const ProjectDetails = require("../schema/projectDetailsSchema");

// Get details for a specific project
exports.getProjectDetails = async (req, res) => {
    try {
        const details = await ProjectDetails.findOne({ projectId: req.params.projectId });
        if (!details) {
            return res.status(404).json({ success: false, message: "Details not found for this project" });
        }
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upsert (Create or Update) details
exports.upsertProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.body;
        const details = await ProjectDetails.findOneAndUpdate(
            { projectId },
            req.body,
            { new: true, upsert: true }
        );
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Delete details
exports.deleteProjectDetails = async (req, res) => {
    try {
        await ProjectDetails.findOneAndDelete({ projectId: req.params.projectId });
        res.status(200).json({ success: true, message: "Details deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Handle Image Upload
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        res.status(200).json({ success: true, url: imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add Review
exports.addReview = async (req, res) => {
    try {
        const { projectId, rating, text, user } = req.body;
        const details = await ProjectDetails.findOne({ projectId });
        if (!details) {
            return res.status(404).json({ success: false, message: "Project details not found" });
        }
        details.reviews.push({ rating, text, user });
        
        // Calculate new overall rating
        const totalRating = details.reviews.reduce((acc, curr) => acc + curr.rating, 0);
        details.overallRating = (totalRating / details.reviews.length).toFixed(1);

        await details.save();
        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
