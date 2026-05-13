const Auth = require("../schema/authentication");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// ================= OTP STORE (in-memory for simplicity) =================
// Key: email, Value: { otp, expiresAt }
const otpStore = new Map();

// ================= EMAIL TRANSPORTER =================
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ================= STEP 1: SEND OTP =================
exports.sendOtp = async (req, res) => {
    try {
        const { email: rawEmail } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email." });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes

        otpStore.set(email, { otp, expiresAt });

        // Send OTP via email
        await transporter.sendMail({
            from: `"DevVision" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "🔐 Your Password Reset OTP",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="text-align: center; margin-bottom: 32px;">
                        <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #f97316, #ea580c); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 900; font-style: italic; color: white; margin-bottom: 16px;">DV</div>
                        <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 900; letter-spacing: -1px;">Password Reset</h1>
                    </div>
                    <p style="color: #9ca3af; font-size: 14px; line-height: 1.6; text-align: center;">Use the OTP below to reset your password. This code expires in <strong style="color: #f97316;">2 minutes</strong>.</p>
                    <div style="background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); border-radius: 16px; padding: 24px; text-align: center; margin: 32px 0;">
                        <span style="font-size: 48px; font-weight: 900; letter-spacing: 8px; color: #f97316;">${otp}</span>
                    </div>
                    <p style="color: #6b7280; font-size: 12px; text-align: center; margin: 0;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        res.status(200).json({ success: true, message: "OTP sent to your email successfully." });
    } catch (error) {
        console.error("Send OTP Error:", error);
        res.status(500).json({ success: false, message: "Failed to send OTP. Please try again.", error: error.message });
    }
};

// ================= STEP 2: VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    try {
        const { email: rawEmail, otp } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Email and OTP are required." });
        }

        const record = otpStore.get(email);

        if (!record) {
            return res.status(400).json({ success: false, message: "OTP not found. Please request a new one." });
        }

        if (Date.now() > record.expiresAt) {
            otpStore.delete(email);
            return res.status(400).json({ success: false, message: "OTP has expired. Please request a new one." });
        }

        if (record.otp !== otp.trim()) {
            return res.status(400).json({ success: false, message: "Invalid OTP. Please try again." });
        }

        // OTP is valid - mark as verified (keep in store with a verified flag)
        otpStore.set(email, { ...record, verified: true });

        res.status(200).json({ success: true, message: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "OTP verification failed.", error: error.message });
    }
};

// ================= STEP 3: RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    try {
        const { email: rawEmail, newPassword, confirmPassword } = req.body;
        const email = rawEmail?.trim().toLowerCase();

        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const record = otpStore.get(email);

        if (!record || !record.verified) {
            return res.status(400).json({ success: false, message: "Please complete OTP verification first." });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUser = await Auth.findOneAndUpdate({ email }, { password: hashedPassword });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Clean up OTP store
        otpStore.delete(email);

        res.status(200).json({ success: true, message: "Password reset successfully! You can now sign in." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Password reset failed.", error: error.message });
    }
};
