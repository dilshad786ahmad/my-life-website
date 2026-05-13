import React, { useState } from "react";
import { Mail, Lock, Home, Sparkles, ArrowRight, Eye, EyeOff } from "lucide-react";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { GoogleLogin } from "@react-oauth/google";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

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

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const { user, login } = useAuth();

  React.useEffect(() => {
    console.log("%c[Google Auth Help]", "color: #f97316; font-weight: bold; font-size: 14px;", "Make sure to add this exact URL to your Google Cloud Console 'Authorized JavaScript origins':", window.location.origin);
  }, []);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "https://my-life-website.onrender.com/api/auth/google",
        { credential: credentialResponse.credential },
        { withCredentials: true }
      );
      const userData = res.data.user;
      const token = res.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);
      toast.success(res.data.message || "Google Sign-In Successful! 🎉");
      setTimeout(() => {
        const from = location.state?.from || "/";
        navigate(from);
      }, 800);
    } catch (err) {
      toast.error(err.response?.data?.message || "Google Sign-In failed");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed.");
  };

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://my-life-website.onrender.com/api/auth/signin", 
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data.user || response.data.data || response.data;
        const token = response.data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        login(userData);

        toast.success(response.data.message || "Welcome back! 🎉");

        setTimeout(() => {
          const from = location.state?.from || "/";
          navigate(from);
        }, 1000);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setCooldownUntil(err.response.data.resetTime);
        setError(err.response.data.message);
      } else {
        setError(err.response?.data?.message || "Invalid Email or Password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 relative overflow-hidden font-sans">
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
              Secure Access
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
            Elevate Your <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Workflow</span> Today
          </h2>
          
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-md">
            Join thousands of professionals who have streamlined their operations and secured their digital assets with our platform.
          </p>

          <div className="flex items-center gap-4 text-gray-500">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} src={`https://i.pravatar.cc/100?u=${i}`} className="w-10 h-10 rounded-full border-2 border-[#050505]" alt="user" />
              ))}
            </div>
            <p className="text-xs font-medium">Joined by <span className="text-white">10k+</span> creators</p>
          </div>
        </motion.div>

        {/* RIGHT SECTION - LOGIN FORM */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white/[0.03] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 md:p-12 w-full max-w-md mx-auto relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
          
          <NavLink to="/" className="absolute top-6 right-6 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors group">
            <Home className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Home</span>
          </NavLink>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2 italic">Welcome back</h2>
            <p className="text-gray-500 text-xs font-medium uppercase tracking-widest">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-2 block">Email Address</label>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-orange-500/50 transition-all shadow-inner">
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
              <div className="flex justify-between items-center mb-2 px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Password</label>
                <NavLink to="/forgot-password" className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-400 cursor-pointer transition-colors">Forgot?</NavLink>
              </div>
              <div className="flex items-center bg-black/40 border border-white/10 rounded-2xl px-4 py-4 focus-within:border-orange-500/50 transition-all shadow-inner relative">
                <Lock className="w-4 h-4 text-gray-500 mr-3" />
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

            {/* Checkbox */}
            <div className="flex items-center gap-3 text-xs text-gray-500 px-1">
              <input type="checkbox" className="w-4 h-4 rounded-md border-white/10 bg-white/5 checked:bg-orange-500 cursor-pointer" />
              <span className="font-medium">Keep me signed in</span>
            </div>

            {/* Sign In Button */}
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
                {loading ? "Verifying..." : <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
              </button>
            )}

            {/* Error Message */}
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-[11px] text-center mt-4 font-bold uppercase tracking-widest bg-red-500/10 py-3 rounded-xl border border-red-500/20"
              >
                {error}
              </motion.p>
            )}

            {/* Google Sign-In - Full Width */}
            <div className="mt-2">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest text-center mb-4">or continue with</p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  ux_mode="redirect"
                  login_uri="https://my-life-website.onrender.com/api/auth/google"
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signin_with"
                />
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-500 mt-6">
              Don't have an account?{' '}
              <NavLink to="/signup" className="text-orange-500 font-bold hover:underline transition-all underline-offset-4">
                Create Account
              </NavLink>
            </p>
          </form>
        </motion.div>
      </div>
    </div>
    </div>
  );
}
