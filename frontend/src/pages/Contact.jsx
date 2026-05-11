import React, { useState, useEffect } from "react";
import { Mail, MapPin, Send, Layout, Smartphone, Brush, Gauge } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { SkeletonBase, TextSkeleton } from "../components/Skeleton";


const IconMap = {
  Mail, MapPin, Layout, Smartphone, Brush, Gauge
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function SpecializedSolutions() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  
  const [pageContent, setPageContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
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

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/contactpage");
        setPageContent(res.data.data);
      } catch (error) {
        console.error("Failed to fetch page content:", error);
      } finally {
        setLoadingContent(false);
      }
    };
    fetchContent();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to send a message.");
      navigate("/signin", { state: { from: "/contact" } });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/contact",
        formData,
        { withCredentials: true }
      );
      if(response.data.success){
        toast.success("Message sent successfully!");
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setCooldownUntil(error.response.data.resetTime);
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/signin");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fallback defaults if content not loaded properly
  const specializedHeading = pageContent?.specializedSection?.heading || "Specialized Solutions";
  const specializedDesc = pageContent?.specializedSection?.description || "Targeted expertise to solve specific challenges across the digital product lifecycle.";
  const cards = pageContent?.specializedSection?.cards || [];

  const contactHeading = pageContent?.contactSection?.heading || "Let's Connect";
  const contactDesc = pageContent?.contactSection?.paragraph || "Have a question or want to work together? Fill out the form, and our team will get back to you within 24 hours.";
  const infoItems = pageContent?.contactSection?.infoItems || [];

  return (
    <div className="bg-[#050505] min-h-screen px-6 pt-32 pb-20 font-sans text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb />
        
        {/* Top Section */}
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
              {loadingContent ? "Syncing Expertise..." : "Expertise"}
            </span>
          </div>
          {loadingContent ? (
            <SkeletonBase className="h-14 w-3/4 rounded-2xl mb-6" />
          ) : (
            <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight">
                {specializedHeading}
            </h2>
          )}
          {loadingContent ? (
            <SkeletonBase className="h-10 w-1/2 rounded-xl" />
          ) : (
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                {specializedDesc}
            </p>
          )}
        </div>

        {/* Solution Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
            {loadingContent ? (
                [1,2,3,4].map(i => (
                    <SkeletonBase key={i} className="h-40 bg-white/5 rounded-3xl" />
                ))
            ) : cards.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col items-center justify-center gap-4 bg-white/[0.02] border border-white/10 rounded-3xl py-10 cursor-pointer transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 backdrop-blur-md hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(59,130,246,0.15)]"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl group-hover:scale-110 transition-transform duration-500">
                  <DynamicIcon name={item.iconName} className="w-7 h-7 text-blue-400" />
                </div>
                <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.title}</p>
              </div>
            ))}
        </div>

        {/* Bottom Section */}
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div>
            {loadingContent ? (
                <SkeletonBase className="h-12 w-3/4 rounded-2xl mb-6" />
            ) : (
                <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
                    {contactHeading}
                </h2>
            )}
            {loadingContent ? (
                <TextSkeleton lines={3} className="mb-10" />
            ) : (
                <p className="text-gray-400 mb-10 max-w-md leading-relaxed text-lg font-light">
                    {contactDesc}
                </p>
            )}

            <div className="space-y-8">
              {loadingContent ? (
                  [1,2].map(i => (
                      <div key={i} className="flex gap-6 items-center">
                          <div className="w-14 h-14 bg-white/5 rounded-2xl animate-pulse"></div>
                          <div className="h-10 w-40 bg-white/5 rounded-xl animate-pulse"></div>
                      </div>
                  ))
              ) : infoItems.map(info => (
                <div key={info._id} className="flex items-start gap-6 group">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl group-hover:bg-orange-500/10 group-hover:border-orange-500/30 transition-colors">
                    <DynamicIcon name={info.iconName} className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] font-bold tracking-widest text-gray-500 uppercase mb-1">{info.label}</p>
                    {/* Render newlines if any */}
                    <p className="text-gray-200 whitespace-pre-line font-medium leading-relaxed">{info.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white/[0.02] p-6 md:p-10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
            
            <form onSubmit={handleSubmit} className="relative z-10">
              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="Jane"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    placeholder="Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Subject */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Message */}
              <div className="mb-8">
                <label className="block text-[11px] font-bold tracking-widest text-gray-400 uppercase mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us more about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Button */}
              {cooldownUntil ? (
                <div className="w-full bg-red-500/10 border border-red-500/20 text-red-500 py-3 rounded-xl font-bold text-sm flex flex-col items-center justify-center gap-1">
                  <span>Too many attempts</span>
                  <span className="text-lg">{formatTime(timeLeft)}</span>
                </div>
              ) : (
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {loading ? "Sending..." : "Send Message"} <Send className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}