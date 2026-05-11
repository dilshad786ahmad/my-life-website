const mongoose = require("mongoose");

const statSchema = new mongoose.Schema({
    num: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String, default: "text-orange-500" }
});

const featureSchema = new mongoose.Schema({
    text: { type: String, required: true },
    color: { type: String, default: "bg-orange-500" }
});

const aboutPageContentSchema = new mongoose.Schema({
    hero: {
        badgeText: { type: String, default: "The Creative Mind" },
        heading: { type: String, required: true },
        subheading: { type: String, required: true },
        description: { type: String, required: true },
        features: [featureSchema],
        resumeLink: { type: String, default: "" },
        githubLink: { type: String, default: "" },
        experienceYears: { type: String, default: "5+" }
    },
    images: [{ type: String }],
    stats: [statSchema]
}, { timestamps: true });

const AboutPageContent = mongoose.model("AboutPageContent", aboutPageContentSchema);

module.exports = AboutPageContent;
