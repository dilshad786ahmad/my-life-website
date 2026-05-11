import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Home, Sparkles, ShieldCheck, RefreshCw, CheckCircle, Eye, EyeOff } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";

const STEPS = ["Email", "OTP", "Reset"];
const OTP_DURATION = 120; // 2 minutes in seconds


export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [timer, setTimer] = useState(OTP_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const otpRefs = useRef([]);

  // Countdown Timer
  useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // --- STEP 1: Send OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email.");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password/send-otp", { email });
      toast.success(res.data.message);
      setStep(2);
      setTimer(OTP_DURATION);
      setTimerActive(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- OTP Input Handling ---
  const handleOtpChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      otpRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  // --- STEP 2: Verify OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) return toast.error("Please enter the complete 6-digit OTP.");
    if (timer === 0) return toast.error("OTP has expired. Please request a new one.");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password/verify-otp", { email, otp: otpStr });
      toast.success(res.data.message);
      setTimerActive(false);
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- Resend OTP ---
  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password/send-otp", { email });
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(OTP_DURATION);
      setTimerActive(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: Reset Password ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters.");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password/reset-password", {
        email, newPassword, confirmPassword,
      });
      toast.success(res.data.message);
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  const slideVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const stepContent = [
    {
      badge: "Account Recovery",
      heading: "Recover Your Account Safely",
      description: "Don't worry — it happens to everyone. Enter your registered email and we'll send you a secure one-time password to verify your identity.",
      points: [
        "100% secure & encrypted OTP delivery",
        "OTP sent directly to your inbox",
        "No personal data is exposed",
      ],
      quote: "\"I recovered my account in under 2 minutes. The process felt secure and straightforward.\"",
      author: "Rahul Sharma — Product Designer",
    },
    {
      badge: "Identity Verification",
      heading: "Verify It's Really You",
      description: "We've sent a 6-digit code to your email. This ensures only you — the real account owner — can reset the password. Never share this OTP with anyone.",
      points: [
        "OTP expires in exactly 2 minutes",
        "One-time use — cannot be reused",
        "Instantly regenerate if needed",
      ],
      quote: "\"The OTP system gave me full confidence that my account was safe throughout the process.\"",
      author: "Priya Mehta — Marketing Lead",
    },
    {
      badge: "Secure Password Reset",
      heading: "Create a Strong New Password",
      description: "Almost done! Set a new, strong password that you haven't used before. Your password is hashed and never stored in plain text — your security is our priority.",
      points: [
        "Passwords are hashed with bcrypt",
        "Never stored in plain text",
        "Immediately active after reset",
      ],
      quote: "\"Knowing my password is encrypted gives me total peace of mind. Excellent security practices.\"",
      author: "Aisha Khan — Tech Lead",
    },
  ];

  const current = stepContent[step - 1];

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-10 relative overflow-hidden font-sans">
      {/* Background glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none" />

      <div className="max-w-6xl w-full relative z-10">
        <Breadcrumb />
        <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT SECTION — Trust Building */}
        <motion.div
          key={step}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col space-y-6 lg:space-y-8 pb-6 lg:pb-0"
        >
          {/* Badge - visible on all screens */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">{current.badge}</span>
          </div>

          {/* Heading - visible on all screens */}
          <h2 className="text-3xl lg:text-5xl font-black text-white leading-[1.1] tracking-tighter">
            {current.heading.split(" ").map((word, i) =>
              i === Math.floor(current.heading.split(" ").length / 2) - 1 ||
              i === Math.floor(current.heading.split(" ").length / 2) ? (
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">{word} </span>
              ) : (
                <span key={i}>{word} </span>
              )
            )}
          </h2>

          {/* Description - desktop only (shown after form on mobile) */}
          <p className="hidden lg:block text-gray-400 text-base font-light leading-relaxed max-w-md">
            {current.description}
          </p>

          {/* Trust Points - desktop only */}
          <ul className="hidden lg:flex flex-col space-y-3">
            {current.points.map((point, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-400">
                <div className="w-5 h-5 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                  <CheckCircle className="w-3 h-3 text-orange-500" />
                </div>
                <span className="text-sm font-medium">{point}</span>
              </li>
            ))}
          </ul>

          {/* Testimonial - desktop only */}
          <div className="hidden lg:flex border-t border-white/10 pt-8 items-start gap-5 max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-orange-500 font-black text-lg">
              {current.author.charAt(0)}
            </div>
            <div>
              <p className="text-gray-400 italic text-sm leading-relaxed">{current.quote}</p>
              <p className="text-[10px] font-black tracking-widest text-orange-500 mt-3 uppercase">{current.author}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION — Form */}
        <div className="w-full">
          {/* Step Progress */}
          <div className="flex items-center justify-center gap-3 mb-10">
          {STEPS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center gap-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition-all duration-500 ${
                  step > i + 1 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                  : step === i + 1 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110"
                  : "bg-white/5 border border-white/10 text-gray-600"
                }`}>
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${step === i + 1 ? "text-orange-500" : "text-gray-600"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px flex-1 mb-5 transition-all duration-500 ${step > i + 1 ? "bg-orange-500" : "bg-white/10"}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-8 md:p-12 w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />

          <NavLink to="/" className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Home</span>
          </NavLink>

          <AnimatePresence mode="wait">
            {/* ==================== STEP 1: EMAIL ==================== */}
            {step === 1 && (
              <motion.div key="step1" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Mail className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">Forgot Password?</h2>
                  <p className="text-gray-500 text-xs leading-relaxed">Enter your registered email address and we'll send you a 6-digit OTP.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Email Address</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                      <Mail className="w-4 h-4 text-gray-500 mr-3" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group"
                  >
                    {loading ? "Sending OTP..." : <><Sparkles className="w-4 h-4" /> Send OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>

                  <p className="text-center text-xs text-gray-500 mt-4">
                    Remember your password?{" "}
                    <NavLink to="/signin" className="text-orange-500 font-bold hover:underline underline-offset-4">Sign In</NavLink>
                  </p>
                </form>
              </motion.div>
            )}

            {/* ==================== STEP 2: OTP ==================== */}
            {step === 2 && (
              <motion.div key="step2" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">Enter OTP</h2>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    We sent a 6-digit code to <span className="text-orange-500 font-bold">{email}</span>
                  </p>
                </div>

                {/* Timer */}
                <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-2xl border ${
                  timer <= 30 ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${timer > 0 ? (timer <= 30 ? "bg-red-500" : "bg-orange-500") : "bg-gray-600"}`} />
                  <span className={`text-xs font-black tracking-widest ${timer <= 30 ? "text-red-400" : "text-gray-400"}`}>
                    {timer > 0 ? `Expires in ${formatTime(timer)}` : "OTP Expired"}
                  </span>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-6">
                  {/* OTP Boxes */}
                  <div className="flex gap-2 justify-center" onPaste={handleOtpPaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpRefs.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(e.target.value, idx)}
                        onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                        className={`w-11 h-14 text-center text-xl font-black bg-black/40 border rounded-2xl outline-none transition-all text-white ${
                          digit ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.2)]" : "border-white/10 focus:border-orange-500/50"
                        }`}
                        disabled={timer === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || timer === 0}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group"
                  >
                    {loading ? "Verifying..." : <><ShieldCheck className="w-4 h-4" /> Verify OTP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>

                  {/* Resend */}
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timer > 0 || loading}
                      className="text-xs font-bold text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend OTP"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* ==================== STEP 3: NEW PASSWORD ==================== */}
            {step === 3 && (
              <motion.div key="step3" variants={slideVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.4 }}>
                <div className="mb-8 text-center">
                  <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Lock className="w-8 h-8 text-orange-500" />
                  </div>
                  <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">New Password</h2>
                  <p className="text-gray-500 text-xs leading-relaxed">Create a strong new password for your account.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  {/* New Password */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">New Password</label>
                    <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                      <Lock className="w-4 h-4 text-gray-500 mr-3" />
                      <input
                        type={showNewPass ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min. 6 characters"
                        className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                        required
                      />
                      <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="text-gray-600 hover:text-gray-400 ml-2">
                        {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Confirm Password</label>
                    <div className={`flex items-center bg-black/40 border rounded-2xl px-4 py-3.5 transition-all shadow-inner ${
                      confirmPassword && confirmPassword !== newPassword ? "border-red-500/50" : "border-white/10 focus-within:border-orange-500/50"
                    }`}>
                      <Lock className="w-4 h-4 text-gray-500 mr-3" />
                      <input
                        type={showConfirmPass ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repeat your password"
                        className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                        required
                      />
                      <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="text-gray-600 hover:text-gray-400 ml-2">
                        {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 group"
                  >
                    {loading ? "Resetting..." : <><CheckCircle className="w-4 h-4" /> Reset Password <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        </div>

        {/* Mobile-only: Description shown below the form card */}
        <motion.div
          key={`desc-${step}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:hidden"
        >
          <p className="text-gray-500 text-sm font-light leading-relaxed text-center px-2">
            {current.description}
          </p>
        </motion.div>

      </div>
    </div>
    </div>
  );
}
