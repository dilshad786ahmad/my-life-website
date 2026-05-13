const { OAuth2Client } = require("google-auth-library");
const Auth = require("../schema/authentication");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleSignIn = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({ success: false, message: "Google credential is required" });
        }

        // Verify the Google ID token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { sub: googleId, email, name, picture } = payload;

        // Find existing user by googleId OR email
        let user = await Auth.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            // Update googleId and avatar if user signed up traditionally before
            if (!user.googleId) {
                user.googleId = googleId;
                user.avatar = picture;
                await user.save();
            }
        } else {
            // Create new Google user
            user = await Auth.create({
                username: name,
                email: email,
                googleId: googleId,
                avatar: picture,
                authProvider: "google",
                password: null,
                mobileNumber: "N/A",
                country: "N/A",
                role: "user",
                status: "online",
            });
        }

        // Update status and login time
        user.status = "online";
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        // Issue JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: req.get("origin")?.includes("localhost") ? false : true,
            sameSite: req.get("origin")?.includes("localhost") ? "lax" : "none",
            maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        });

        // Detect if this is a Google Redirect (form-encoded) or a Client-side Axios call
        const isRedirect = req.headers['content-type']?.includes('application/x-www-form-urlencoded');

        if (isRedirect) {
            // Detect origin for redirect back to frontend
            const origin = req.get("origin") || req.get("referer");
            const redirectUrl = origin?.includes("localhost") 
                ? "http://localhost:5173" 
                : "https://my-life-website-cjdr.vercel.app";
            
            return res.redirect(redirectUrl);
        }

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            status: user.status,
        };

        res.status(200).json({
            success: true,
            message: `Welcome, ${user.username}! 🎉`,
            user: userData,
            token,
        });

    } catch (error) {
        console.error("Google Sign-In Error:", error);
        res.status(500).json({ success: false, message: "Google Sign-In failed. Please try again." });
    }
};
