const mongoose = require("mongoose");

const serviceCardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Code" },
    tags: [{ type: String }],
    iconColor: { type: String, default: "text-orange-400" }
});

const servicesPageContentSchema = new mongoose.Schema({
    header: {
        badgeText: { type: String, default: "Our Expertise" },
        heading: { type: String, default: "What I Offer" },
        description: { type: String, required: true }
    },
    services: [serviceCardSchema]
}, { timestamps: true });

const ServicesPageContent = mongoose.model("ServicesPageContent", servicesPageContentSchema);

module.exports = ServicesPageContent;
