const mongoose = require("mongoose");

const skillItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String },
    icon: { type: String, default: "Code" }
});

const softSkillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    icon: { type: String, default: "Users" }
});

const skillsPageContentSchema = new mongoose.Schema({
    header: {
        badgeText: { type: String, default: "Capabilities" },
        title: { type: String, default: "My Skills" },
        description: { type: String, required: true }
    },
    technicalSkills: [skillItemSchema],
    softSkills: [softSkillSchema],
    cta: {
        title: { type: String, default: "Looking for a specific skill?" },
        description: { type: String, required: true },
        resumeLink: { type: String },
        contactLink: { type: String }
    },
    codeBox: {
        code: { type: String, required: true }
    }
}, { timestamps: true });

const SkillsPageContent = mongoose.model("SkillsPageContent", skillsPageContentSchema);

module.exports = SkillsPageContent;
