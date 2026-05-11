const mongoose = require("mongoose");

const contactSubmissionSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["new", "read", "replied"],
            default: "new"
        },
        adminNotes: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
);

const ContactSubmission = mongoose.model("ContactSubmission", contactSubmissionSchema);

module.exports = ContactSubmission;
