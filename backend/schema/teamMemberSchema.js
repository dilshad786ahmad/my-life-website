const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    socialLinks: {
        facebook: String,
        twitter: String,
        linkedin: String,
        instagram: String
    },
    skills: [String],
    achievements: [String],
    projects: [{
        title: String,
        description: String,
        image: String,
        link: String
    }],
    email: String,
    phone: String,
    location: String
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
