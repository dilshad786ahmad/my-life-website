const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Cloud" } // Lucide icon name
});

const homePageContentSchema = new mongoose.Schema({
    hero: {
        badgeText: { type: String, default: "Precision Engineering" },
        heading: { type: String, required: true },
        subheading: { type: String, required: true },
        images: [{ type: String }],
        mainImage: { type: String, default: "" },
        cardImages: [{ type: String }]
    },
    socialLinks: {
        youtube: { type: String, default: "" },
        instagram: { type: String, default: "" },
        linkedin: { type: String, default: "" },
        x: { type: String, default: "" },
        facebook: { type: String, default: "" },
        whatsapp: { type: String, default: "" }
    },
    introCards: [cardSchema]
}, { timestamps: true });

const HomePageContent = mongoose.model("HomePageContent", homePageContentSchema);

module.exports = HomePageContent;
