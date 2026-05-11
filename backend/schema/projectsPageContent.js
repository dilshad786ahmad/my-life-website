const mongoose = require("mongoose");

const projectItemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    link: { type: String, default: "#" },
    description: { type: String },
    tags: [{ type: String }],
    price: { type: Number, default: 0 }, // New field for sorting
    originalPrice: { type: Number, default: 0 } // For offer/discount display
});

const projectsPageContentSchema = new mongoose.Schema({
    header: {
        badgeText: { type: String, default: "Selected Works" },
        title: { type: String, default: "Featured Projects" },
        description: { type: String, required: true }
    },
    projects: [projectItemSchema]
}, { timestamps: true });

const ProjectsPageContent = mongoose.model("ProjectsPageContent", projectsPageContentSchema);

module.exports = ProjectsPageContent;
