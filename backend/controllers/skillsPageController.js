const SkillsPageContent = require("../schema/skillsPageContent");

// Get Skills
exports.getSkillsPageContent = async (req, res) => {
    try {
        let content = await SkillsPageContent.findOne();
        if (!content) {
            content = await SkillsPageContent.create({
                header: {
                    description: "A comprehensive overview of my technical expertise and professional capabilities."
                },
                technicalSkills: [
                    { name: "React", desc: "Frontend Framework", icon: "Code" },
                    { name: "Node.js", desc: "Runtime Environment", icon: "Server" }
                ],
                softSkills: [
                    { name: "Collaboration", icon: "Users" },
                    { name: "Communication", icon: "MessageCircle" }
                ],
                cta: {
                    description: "I'm always learning new technologies. Let's discuss how I can adapt."
                },
                codeBox: {
                    code: 'const developer = {\n  name: "Pro Portfolio",\n  role: "Full Stack Engineer",\n  skills: ["React", "Node", "Cloud"],\n  readyForWork: true\n};'
                }
            });
        }
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Header
exports.updateSkillsHeader = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { header: req.body }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Technical Skills
exports.updateTechSkills = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { technicalSkills: req.body.skills }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Soft Skills
exports.updateSoftSkills = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { softSkills: req.body.skills }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update CTA & CodeBox
exports.updateSkillsMisc = async (req, res) => {
    try {
        const content = await SkillsPageContent.findOneAndUpdate({}, { cta: req.body.cta, codeBox: req.body.codeBox }, { new: true, upsert: true });
        res.status(200).json({ success: true, data: content });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
