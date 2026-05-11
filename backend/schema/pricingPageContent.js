const mongoose = require("mongoose");

// Sub-schema: Basic Plans
const planSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    suffix: { type: String, default: "/project" },
    desc: { type: String, required: true },
    features: [{ type: String }],
    highlight: { type: Boolean, default: false }
});

// Sub-schema: Standard Solutions (Has Image instead of highlight badge)
const standardSolutionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    features: [{ type: String }]
});

// Sub-schema: Enterprise Systems (Has Icon)
const enterpriseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: String, required: true },
    desc: { type: String, required: true },
    icon: { type: String, required: true }, // Emoji or Icon name
    features: [{ type: String }],
    highlight: { type: Boolean, default: false }
});

// Main Schema
const pricingPageContentSchema = new mongoose.Schema({
    header: {
        title: { type: String, default: "Transparent & Scalable Pricing" },
        subtitle: { type: String, default: "Flexible plans tailored for your business growth." },
        highlightText: { type: String, default: "Final price may be adjusted based on your exact requirements." }
    },
    basicPlans: [planSchema],
    standardSolutions: [standardSolutionSchema],
    enterpriseSystems: [enterpriseSchema]
}, { timestamps: true });

const PricingPageContent = mongoose.model("PricingPageContent", pricingPageContentSchema);

module.exports = PricingPageContent;
