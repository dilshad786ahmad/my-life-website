const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required:true,
            trim: true
        },
        mobileNumber: {
            type: String,
            default: "N/A"
        },
        country: {
            type: String,
            default: "N/A"
        },
       
        email: {
            type: String,
            required:true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            minlength: 6,
            default: null
        },
        googleId: {
            type: String,
            default: null
        },
        avatar: {
            type: String,
            default: null
        },
        authProvider: {
            type: String,
            enum: ["google", "email"],
            default: "email"
        },
        // Connectivity Status (Session)
        status: {
            type: String,
            enum: ["online", "offline"],
            default: "offline"
        },

        role: {
        type: String,
        enum: ["user", "admin"],
        default: "user" // By default sab normal user honge
    },

        // Lead Interest Status (Naya Field)
        leadStatus: {
            type: String,
            enum: ["pending", "interested", "not interested", "talk to later"],
            default: "pending" // Shuruat mein status 'pending' rahega
        },

        query: {
            type: String,
          
        },

        lastActive: {
            type: Date,
            default: Date.now
        },

        lastLogin: {
            type: Date
        },

        loginCount: {
            type: Number,
            default: 0
        },

        // --- Naya Session Tracking Field ---
        activityLog: [{
            loginTime: {
                type: Date,
                default: Date.now
            },
            logoutTime: {
                type: Date
            },
            duration: {
                type: String
            }
        }]
    },
    { timestamps: true }
);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;