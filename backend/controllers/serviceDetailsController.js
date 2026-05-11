const ServiceDetails = require("../schema/serviceDetailsSchema");

// Get details for a specific service by serviceId
exports.getServiceDetails = async (req, res) => {
    try {
        const { serviceId } = req.params;
        let details = await ServiceDetails.findOne({ serviceId });

        if (!details) {
            return res.status(200).json({ success: true, data: null });
        }

        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ message: "Error fetching service details", error: error.message });
    }
};

// Create or Update service details (Admin only)
exports.upsertServiceDetails = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const updateData = req.body;

        const details = await ServiceDetails.findOneAndUpdate(
            { serviceId },
            { $set: updateData },
            { new: true, upsert: true }
        );

        res.status(200).json({ success: true, data: details });
    } catch (error) {
        res.status(500).json({ message: "Error updating service details", error: error.message });
    }
};

// Delete service details (Admin only)
exports.deleteServiceDetails = async (req, res) => {
    try {
        const { serviceId } = req.params;
        await ServiceDetails.findOneAndDelete({ serviceId });
        res.status(200).json({ success: true, message: "Service details deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting service details", error: error.message });
    }
};
