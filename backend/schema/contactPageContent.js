const mongoose = require("mongoose");

// 1. Solution Card Sub-schema
const solutionCardSchema = new mongoose.Schema({
    iconName: { 
        type: String, 
        required: true,
        trim: true 
    },
    title: { 
        type: String, 
        required: true,
        trim: true 
    }
});

// 2. Contact Info Item Sub-schema
const contactInfoItemSchema = new mongoose.Schema({
    iconName: { 
        type: String, 
        required: true,
        trim: true 
    },
    label: { 
        type: String, 
        required: true,
        trim: true 
    },
    value: { 
        type: String, 
        required: true,
        trim: true 
    }
});

// 3. Main Contact Page Schema
const contactPageContentSchema = new mongoose.Schema(
    {
        // Top Section (Specialized Solutions)
        specializedSection: {
            heading: {
                type: String,
                required: true,
                default: "Specialized Solutions"
            },
            description: {
                type: String,
                required: true,
                default: "Targeted expertise to solve specific challenges across the digital product lifecycle."
            },
            cards: [solutionCardSchema] // Array of Separate Sub-schema
        },

        // Bottom Section (Contact Details)
        contactSection: {
            heading: {
                type: String,
                required: true,
                default: "Let's Connect"
            },
            paragraph: {
                type: String,
                required: true,
                default: "Have a question or want to work together? Fill out the form, and our team will get back to you within 24 hours."
            },
            infoItems: [contactInfoItemSchema] // Array of Separate Sub-schema
        }
    },
    
    { timestamps: true }
);

const ContactPageContent = mongoose.model("ContactPageContent", contactPageContentSchema);

module.exports = ContactPageContent;