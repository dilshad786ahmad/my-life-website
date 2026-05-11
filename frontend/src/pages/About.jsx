import { useState, useEffect } from "react";
import Team from "./our_team";
import { Download, ExternalLink, Sparkles, LogIn, MessageCircle, X, AlertCircle } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import { GitHub } from "../components/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { SkeletonBase, TextSkeleton } from "../components/Skeleton";

export default function About() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/aboutpage");
        setContent(res.data.data);
      } catch (error) {
        console.error("Error fetching about content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const images = content?.images?.length > 0 ? content.images : [
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    "https://images.unsplash.com/photo-1556761175-4b46a572b786",
  ];

  const stats = content?.stats?.length > 0 ? content.stats : [
    { num: "50+", label: "Projects Completed", color: "text-orange-500" },
    { num: "30+", label: "Global Clients", color: "text-blue-400" },
    { num: "12+", label: "Technologies", color: "text-orange-500" },
    { num: "24/7", label: "Consultation", color: "text-blue-400" },
  ];

  useEffect(() => {
    if (images.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images]);

  const hero = content?.hero || {
    badgeText: "The Creative Mind",
    heading: "Bridging Design & Engineering",
    subheading: "I'm a multidisciplinary designer and developer focused on crafting high-end digital experiences.",
    description: "Crafting digital experiences that combine aesthetic excellence with technical precision.",
    experienceYears: "5+"
  };

  const handleConnect = () => {
    if (user) {
      navigate("/contact");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
  <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans">
    {/* Background ambient glows */}
    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
    <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

    <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
      <Breadcrumb />
      
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

        {/* LEFT */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
              {loading ? "Profile Loading..." : hero.badgeText}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4 mb-8">
                <SkeletonBase className="h-12 md:h-16 rounded-2xl w-full" />
                <SkeletonBase className="h-12 md:h-16 rounded-2xl w-3/4" />
            </div>
          ) : (
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter leading-[1.1]">
                {hero.heading}
            </h2>
          )}

          {loading ? (
            <TextSkeleton lines={3} className="mb-12" />
          ) : (
            <>
                <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed mb-8 max-w-xl">
                    {hero.subheading}
                </p>
                <p className="text-gray-500 text-base leading-relaxed mb-12 max-w-lg">
                    {hero.description}
                </p>
            </>
          )}

          {/* BUTTONS */}
          <div className="flex flex-wrap gap-5">
            {loading ? (
                <div className="h-14 w-40 bg-white/5 rounded-2xl animate-pulse"></div>
            ) : (
              <>
                <a 
                  href={hero.resumeLink || "#"} 
                  download 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative overflow-hidden px-8 py-4 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)] transition-all duration-300 hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Resume Download <Download className="w-4 h-4" />
                  </span>
                </a>

                <button 
                  onClick={handleConnect}
                  className="group px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300 flex items-center gap-2 backdrop-blur-md hover:border-white/20"
                >
                  Connect With Me <MessageCircle className="w-4 h-4 text-orange-500 group-hover:scale-110 transition-transform" />
                </button>
              </>
            )}
          </div>
        </motion.div>

        {/* RIGHT IMAGE */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 via-blue-500/10 to-transparent rounded-[3rem] blur-2xl opacity-50"></div>
          
          <div className="relative w-full h-[500px] md:h-[600px] rounded-[2.5rem] overflow-hidden group border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#0a0a0a]">
            {loading ? (
                <div className="w-full h-full bg-white/5 animate-pulse"></div>
            ) : (
                <>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={index}
                    src={`${images[index]}?auto=format&fit=crop&q=80&w=800&fm=webp`}
                    loading="lazy"
                    width="600"
                    height="600"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.8, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="w-full h-full object-cover"
                    alt="About Portfolio"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent"></div>
                </>
            )}
            
            {/* Image Indicators */}
            {!loading && (
                <div className="absolute bottom-10 right-10 flex gap-2 z-20">
                  {images.map((_, i) => (
                    <div 
                      key={i}
                      className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-orange-500" : "w-2 bg-white/20"}`}
                    />
                  ))}
                </div>
            )}
          </div>

          {/* FLOAT CARD */}
          {!loading && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="absolute -bottom-10 -left-10 bg-[#0d0d0d]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] px-8 py-6 rounded-3xl flex items-center gap-6 group hover:border-orange-500/30 transition-all duration-500 hidden md:flex"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-[0_10px_20px_rgba(249,115,22,0.3)]">
                  <span className="text-white text-3xl font-black italic">{hero.experienceYears}</span>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase mb-1">Expertise</p>
                  <h4 className="font-black text-white text-xl tracking-tight">Years Active</h4>
                </div>
              </motion.div>
          )}
        </motion.div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-24">
        {loading ? (
            [1,2,3,4].map(i => (
                <SkeletonBase key={i} className="h-40 bg-white/5 rounded-[2.5rem]" />
            ))
        ) : stats.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            viewport={{ once: true }}
            className="group bg-white/[0.02] border border-white/10 p-10 rounded-[2.5rem] text-center backdrop-blur-md hover:bg-white/[0.04] hover:border-white/20 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h3 className={`text-4xl md:text-5xl font-black ${item.color} mb-3 tracking-tighter`}>
              {item.num}
            </h3>
            <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] uppercase">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
    
    <div className="relative z-10 border-t border-white/5 bg-[#080808]/50">
      <Team/>
    </div>

    {/* AUTH MODAL */}
    <AnimatePresence>
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => setShowAuthModal(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 w-full max-w-sm overflow-hidden text-center"
          >
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-center mb-6 mx-auto">
              <AlertCircle className="w-10 h-10 text-orange-500" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight italic mb-4">Authentication Required</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-10">
              Please <span className="text-white font-bold">Sign In</span> or <span className="text-white font-bold">Sign Up</span> first to access the contact form and connect with me directly.
            </p>

            <div className="flex flex-col gap-4">
              <button 
                onClick={() => navigate("/signin")}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3"
              >
                <LogIn className="w-5 h-5" /> Sign In Now
              </button>
              <button 
                onClick={() => navigate("/signup")}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"
              >
                Create New Account
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
  );
}