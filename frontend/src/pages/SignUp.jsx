import React, { useState } from "react";
import { Mail, Lock, User, Phone, Globe, Home, Sparkles, ArrowRight, ShieldCheck, RefreshCw, CheckCircle, Eye, EyeOff } from "lucide-react";
import { GitHub } from "../components/BrandIcons";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    mobileNumber: "",
    country: "",
    email: "",
    password: "",
    role: "user",
  });

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [timerActive, setTimerActive] = useState(false);
  const otpRefs = React.useRef([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [adminExists, setAdminExists] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  React.useEffect(() => {
    let interval;
    if (cooldownUntil) {
      interval = setInterval(() => {
        const now = new Date();
        const resetTime = new Date(cooldownUntil);
        const diff = Math.max(0, Math.floor((resetTime - now) / 1000));
        setTimeLeft(diff);
        if (diff === 0) setCooldownUntil(null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownUntil]);
  const { user } = useAuth();

  React.useEffect(() => {
    let interval;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  React.useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/check-admin");
        setAdminExists(res.data.exists);
      } catch (err) {
        console.error("Error checking admin status:", err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/send-signup-otp", 
        { email: formData.email }
      );

      toast.success(response.data.message || "OTP sent successfully!");
      setStep(2);
      setTimer(120);
      setTimerActive(true);
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err) {
      if (err.response?.status === 429) {
        setCooldownUntil(err.response.data.resetTime);
        toast.error(err.response.data.message);
      } else {
        const errorMessage = err.response?.data?.message || "Failed to send OTP.";
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndSignup = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) return toast.error("Please enter the complete 6-digit OTP.");
    if (timer === 0) return toast.error("OTP has expired. Please request a new one.");

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup", 
        { ...formData, otp: otpStr },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success(response.data.message || "Registration Successful! 🎉");

        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 py-10 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-6xl w-full relative z-10">
        <Breadcrumb />
        <div className="grid lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT SECTION */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
              Join the Elite
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
            Elevate Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Workflow</span> Today
          </h2>
          
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
            Join thousands of professionals who have streamlined their operations and secured their digital assets.
          </p>

          <div className="border-t border-white/10 pt-8 flex items-start gap-6 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
               <img src="https://i.pravatar.cc/100?u=sarah" alt="user" className="w-10 h-10 rounded-xl" />
            </div>
            <div>
              <p className="text-gray-400 italic text-sm leading-relaxed">
                "Implementing CorporateAuth reduced our onboarding time by 40% and completely eliminated security-related downtime."
              </p>
              <p className="text-[10px] font-black tracking-widest text-orange-500 mt-4 uppercase">
                Sarah Jenkins — CTO, TechSolutions
              </p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SECTION - SIGNUP FORM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 md:p-12 w-full max-w-md mx-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden mt-10 md:mt-0"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
          
          <NavLink to="/" className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Home</span>
          </NavLink>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">Create Account</h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Get started for free</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleSubmit} 
                className="space-y-5"
              >
            {/* Name */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Full Name</label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                <User className="w-4 h-4 text-gray-500 mr-3" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                  required
                />
              </div>
            </div>

            {/* Mobile & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Phone</label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                  <Phone className="w-4 h-4 text-gray-500 mr-3" />
                  <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="987..."
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Country</label>
                <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                  <Globe className="w-4 h-4 text-gray-500 mr-3" />
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="India"
                    className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Email Address</label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner">
                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Password</label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-3.5 focus-within:border-orange-500/50 transition-all shadow-inner relative">
                <Lock className="w-4 h-4 text-gray-400 mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="********"
                  className="w-full bg-transparent outline-none text-sm text-white placeholder-gray-700 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  formData.role === "user"
                    ? "bg-white text-black shadow-[0_4px_10px_rgba(255,255,255,0.1)]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                User
              </button>
              {!adminExists && (
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "admin" })}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    formData.role === "admin"
                      ? "bg-orange-500 text-white shadow-[0_4px_10px_rgba(249,115,22,0.2)]"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  Admin
                </button>
              )}
            </div>

            {/* Submit Button */}
            {cooldownUntil ? (
              <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex flex-col items-center justify-center gap-1">
                <span>Too many attempts</span>
                <span className="text-lg">{formatTime(timeLeft)}</span>
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? "Sending OTP..." : <>Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            )}
            
            <p className="text-center text-xs text-gray-500 mt-6">
              Already have an account?{' '}
              <NavLink to="/signin" className="text-orange-500 font-bold hover:underline transition-all underline-offset-4">
                Sign In
              </NavLink>
            </p>
          </motion.form>
            )}

            {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="mb-6 text-center">
                <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-2xl border ${
                  timer <= 30 ? "bg-red-500/10 border-red-500/20" : "bg-white/5 border-white/10"
                }`}>
                  <div className={`w-2 h-2 rounded-full animate-pulse ${timer > 0 ? (timer <= 30 ? "bg-red-500" : "bg-orange-500") : "bg-gray-600"}`} />
                  <span className={`text-xs font-black tracking-widest ${timer <= 30 ? "text-red-400" : "text-gray-400"}`}>
                    {timer > 0 ? `Expires in ${formatTime(timer)}` : "OTP Expired"}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">Enter the 6-digit code sent to <br/><strong className="text-white">{formData.email}</strong></p>
              </div>

              <form onSubmit={handleVerifyAndSignup} className="space-y-6">
                <div className="flex gap-2 justify-center">
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
                  {loading ? "Verifying..." : <><ShieldCheck className="w-4 h-4" /> Verify & Register <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                </button>

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={timer > 0 || loading}
                    className="text-xs font-bold text-gray-500 hover:text-orange-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 mx-auto"
                  >
                    <RefreshCw className="w-3 h-3" />
                    {timer > 0 ? `Resend in ${formatTime(timer)}` : "Resend OTP"}
                  </button>
                  <button type="button" onClick={() => setStep(1)} className="text-xs text-gray-400 hover:text-white mt-4 underline">Back to details</button>
                </div>
              </form>
            </motion.div>
          )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
    </div>
  );
}