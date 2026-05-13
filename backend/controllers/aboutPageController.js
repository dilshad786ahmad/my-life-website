const AboutPageContent = require("../schema/aboutPageContent");

// Get About Page Content
exports.getAboutPageContent = async (req, res) => {
    try {
        let content = await AboutPageContent.findOne();
        if (!content) {
            // Create default content if none exists
            content = await AboutPageContent.create({
                hero: {
                    heading: "Bridging Design & Engineering",
                    subheading: "I'm a multidisciplinary designer and developer focused on crafting high-end digital experiences.",
                    description: "Crafting digital experiences that combine aesthetic excellence with technical precision."
                }
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Hero Section
exports.updateHeroSection = async (req, res) => {
    try {
        const content = await AboutPageContent.findOneAndUpdate({}, { hero: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add/Update Stat
exports.updateStats = async (req, res) => {
    try {
        const content = await AboutPageContent.findOneAndUpdate({}, { stats: req.body.stats }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Images
exports.updateImages = async (req, res) => {
    try {
        const content = await AboutPageContent.findOneAndUpdate({}, { images: req.body.images }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload Resume File
exports.uploadResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        
        // Update the about page content with the new resume link
        const content = await AboutPageContent.findOne();
        if (content) {
            content.hero.resumeLink = fileUrl;
            await content.save();
        } else {
            // Create if not exists
            await AboutPageContent.create({
                hero: {
                    heading: "Bridging Design & Engineering",
                    subheading: "I'm a multidisciplinary designer and developer focused on crafting high-end digital experiences.",
                    description: "Crafting digital experiences that combine aesthetic excellence with technical precision.",
                    resumeLink: fileUrl
                }
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Resume uploaded successfully", 
            resumeLink: fileUrl 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload General Image
exports.uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        res.status(200).json({ 
            success: true, 
            message: "Image uploaded successfully", 
            url: fileUrl 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
