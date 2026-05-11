const mongoose = require("mongoose");

const serviceFeatureSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, default: "Layout" }
});

const serviceDetailsSchema = new mongoose.Schema({
    serviceId: { type: String, required: true, unique: true }, // Links to service item ID in ServicesPageContent
    title: { type: String, required: true },
    description: { type: String, required: true },
    mainImage: { type: String },
    breadcrumb: { type: String, default: "Home > Services" },
    subTitle: { type: String, default: "OUR TECHNOLOGY ECOSYSTEM" },
    subHeading: { type: String, default: "Integrated Product Design" },
    features: [serviceFeatureSchema],
    consultationLink: { type: String, default: "#" },
    portfolioLink: { type: String, default: "#" }
}, { timestamps: true });

module.exports = mongoose.model("ServiceDetails", serviceDetailsSchema);
