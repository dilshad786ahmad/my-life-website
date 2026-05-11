const ServicesPageContent = require("../schema/servicesPageContent");
const ServiceDetails = require("../schema/serviceDetailsSchema");

// Get Services
exports.getServicesPageContent = async (req, res) => {
    try {
        let content = await ServicesPageContent.findOne();
        if (!content) {
            content = await ServicesPageContent.create({
                header: {
                    description: "Delivering high-quality digital solutions tailored to your business needs."
                },
                services: [
                    { title: "UI/UX Design", description: "Crafting intuitive experiences.", icon: "Palette", tags: ["Figma", "Prototyping"], iconColor: "text-orange-400" },
                    { title: "Web Development", description: "Building robust web apps.", icon: "Code", tags: ["React", "Node.js"], iconColor: "text-blue-400" },
                    { title: "Brand Identity", description: "Developing visual systems.", icon: "Monitor", tags: ["Strategy", "Logo"], iconColor: "text-orange-400" }
                ]
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Header
exports.updateServicesHeader = async (req, res) => {
    try {
        const content = await ServicesPageContent.findOneAndUpdate({}, { header: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Services (Admin only)
exports.updateServicesCards = async (req, res) => {
    try {
        const { services } = req.body;
        
        // Get existing services to identify deleted ones
        const existingContent = await ServicesPageContent.findOne();
        if (existingContent) {
            const existingIds = existingContent.services.map(s => s._id.toString());
            const newIds = services.map(s => s._id?.toString()).filter(id => id);
            
            // Find IDs that are in existing but not in new
            const deletedIds = existingIds.filter(id => !newIds.includes(id));
            
            // Delete associated details for removed cards
            if (deletedIds.length > 0) {
                await ServiceDetails.deleteMany({ serviceId: { $in: deletedIds } });
            }
        }

        const content = await ServicesPageContent.findOneAndUpdate({}, { services }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
