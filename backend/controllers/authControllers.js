const Auth = require("../schema/authentication");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ================= OTP STORE (in-memory for simplicity) =================
// Key: email, Value: { otp, expiresAt }
const signupOtpStore = new Map();

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ================= CHECK ADMIN EXISTS =================
exports.checkAdminExists = async (req, res) => {
    try {
        const admin = await Auth.findOne({ role: "admin" });
        res.status(200).json({ exists: !!admin });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= SIGNUP =================
exports.signup = async (req, res) => {
    try {
        const { username, email, password, mobileNumber, country, role, otp } = req.body;

        // ✅ Validation (FIRST)
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        if (!country) {
            return res.status(400).json({ message: "Country is required" });
        }

        // ✅ Check existing user (AFTER validation)
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // ✅ Check if admin already exists if registering as admin
        if (role === "admin") {
            const adminExists = await Auth.findOne({ role: "admin" });
            if (adminExists) {
                return res.status(400).json({ message: "An admin is already registered. Only one admin is allowed." });
            }
        }

        // ✅ OTP Validation
        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        const record = signupOtpStore.get(email);

        if (!record) {
            return res.status(400).json({ message: "OTP not found. Please request a new one." });
        }

        if (Date.now() > record.expiresAt) {
            signupOtpStore.delete(email);
            return res.status(400).json({ message: "OTP has expired. Please request a new one." });
        }

        if (record.otp !== otp.trim()) {
            return res.status(400).json({ message: "Invalid OTP. Please try again." });
        }

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Create user
        const newUser = await Auth.create({
            username,
            email,
            password: hashedPassword,
            mobileNumber,
            country,
            role: role || "user",
            authProvider: "email"
        });

        // ❌ Password hide
        
        // Clean up OTP store after successful registration
        signupOtpStore.delete(email);

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                mobileNumber: newUser.mobileNumber, // added
                country: newUser.country,           // added
                password: newUser.password          // added (lekin ek baat dhyan rakhna)
            },
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// ================= SEND SIGNUP OTP =================
exports.sendSignupOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

        signupOtpStore.set(email, { otp, expiresAt });

        // Send OTP via email
        await transporter.sendMail({
            from: `"DevVision" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🚀 Welcome! Verify Your Email",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">Verify Your Email</h1>
                    </div>
                    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; text-align: center;">Please use the OTP below to complete your registration. This code expires in <strong style="color: #f97316;">2 minutes</strong>.</p>
                    <div style="background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 32px 0;">
                        <span style="font-size: 48px; font-weight: 900; letter-spacing: 8px; color: #f97316;">${otp}</span>
                    </div>
                </div>
            `,
        });

        res.status(200).json({ message: "OTP sent to your email successfully." });
    } catch (error) {
        console.error("Send Signup OTP Error:", error);
        res.status(500).json({ message: "Failed to send OTP.", error: error.message });
    }
};

// ================= SIGNIN =================

exports.signin = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Validation
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // 2. Check user
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 2b. Check Role
        if (role && user.role !== role) {
            return res.status(403).json({ message: `Access denied. You are not registered as ${role}.` });
        }

        // 3. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // 3b. Update Login History & Status
        user.status = "online";
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        // 4. Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "2d" }
        );

        // 5. COOKIE OPTIONS
        const cookieOptions = {
            expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 din (Token ki expiry se match karein)
            httpOnly: true, // Security: Frontend JS isse read nahi kar payegi
            secure: true, // true karna zaroori hai sameSite 'none' ke liye
            sameSite: "none" // cross-origin requests ke liye 'none'
        };

        // 6. Send Cookie and Response
        res.status(200)
            .cookie("token", token, cookieOptions) // Cookie yahan set ho rahi hai
            .json({
                message: "Login successful",
                token, // Token abhi bhi bhej rahe hain (optional agar sirf cookie use karni ho)
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                },
            });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ================= LOGOUT =================

exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await Auth.findByIdAndUpdate(decoded.id, { status: "offline" });
        }
        res.cookie("token", "", { 
            expires: new Date(0),
            httpOnly: true,
            secure: true,
            sameSite: "none"
        });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error during logout", error: error.message });
    }
};

// ================= GET ME (Identity Sync) =================
exports.getMe = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await Auth.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};