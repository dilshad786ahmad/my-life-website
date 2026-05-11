const mongoose = require("mongoose");

const contentSectionSchema = new mongoose.Schema({
    heading: { type: String, required: true },
    paragraph: { type: String, required: true },
    image: { type: String, default: "" }, // Optional image
    features: [{ type: String }]          // Optional bullet points
});

const dynamicPageSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true }, // e.g. "get-started"
    title: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    sections: [contentSectionSchema]
}, { timestamps: true });

module.exports = mongoose.model("DynamicPage", dynamicPageSchema);
