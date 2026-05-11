const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, default: 5 },
    text: { type: String },
    user: { type: String, default: "Verified User" }
});

const projectDetailsSchema = new mongoose.Schema({
    projectId: { type: String, required: true, unique: true }, // Links to project item ID in ProjectsPageContent
    caseStudyBadge: { type: String, default: "Case Study" },
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    category: { type: String, default: "Big Project" }, // New field
    price: { type: Number, default: 0 },
    originalPrice: { type: Number, default: 0 },
    mainImage: { type: String },
    thumbnails: [{ type: String }],
    challengeTitle: { type: String, default: "The Challenge" },
    challengeDescription: { type: String },
    outcomesTitle: { type: String, default: "Key Outcomes" },
    outcomesList: [{ type: String }],
    socialProofTitle: { type: String, default: "Social Proof" },
    overallRating: { type: Number, default: 4.8 },
    reviews: [reviewSchema],
    projectBrief: {
        timeline: { type: String },
        client: { type: String },
        role: { type: String }
    },
    techStack: [{ type: String }],
    liveLink: { type: String, default: "#" }
}, { timestamps: true });

module.exports = mongoose.model("ProjectDetails", projectDetailsSchema);
