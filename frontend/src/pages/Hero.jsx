import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { Cloud, Lock, BarChart3, ArrowRight, Box, Layout } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { CardSkeleton, HeroStackSkeleton, SkeletonBase } from "../components/Skeleton";

const IconMap = { Cloud, Lock, BarChart3, Box, Layout };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const TypingText = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeedRef = useRef(100);
  const timerRef = useRef(null);

  useEffect(() => {
    const fullText = text || "";
    const words = fullText.split(" ");
    const stopIndex = words.length > 2
      ? words.slice(0, -2).join(" ").length + 1
      : 0;

    const handleType = () => {
      setDisplayText(prev => {
        const currentText = isDeleting
          ? fullText.substring(0, prev.length - 1)
          : fullText.substring(0, prev.length + 1);

        if (!isDeleting && currentText === fullText) {
          typingSpeedRef.current = 3000;
          setTimeout(() => setIsDeleting(true), 3000);
        } else if (isDeleting && currentText.length <= stopIndex) {
          typingSpeedRef.current = 500;
          setTimeout(() => setIsDeleting(false), 500);
        } else {
          typingSpeedRef.current = isDeleting ? 60 : 100;
        }
        return currentText;
      });
    };

    timerRef.current = setTimeout(handleType, typingSpeedRef.current);
    return () => clearTimeout(timerRef.current);
  }, [displayText, isDeleting, text]);

  // Split text to color the last word
  const words = displayText.split(" ");
  const lastWord = words.length > 1 ? words.pop() : "";
  const remainingText = words.join(" ");

  return (
    <span className={`${className} inline-block min-h-[1.2em]`}>
      {remainingText} {lastWord && <span className="text-orange-500">{lastWord}</span>}
      <span className="animate-pulse text-orange-500 ml-1">|</span>
    </span>
  );
};

export default function Home() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const { user } = useAuth(); 
  const { isDarkMode } = useTheme();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://my-life-website.onrender.com/api/homepage");
        setContent(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home content:", error);
      }
    };
    fetchData();
  }, []);

  const images = content?.hero?.images?.length > 0 ? content.hero.images.map(img => `${img}?auto=format&fit=crop&q=80&w=1200&fm=webp`) : [];

  // Auto change background
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      if (!document.hidden) {
        setIndex((prev) => (prev + 1) % images.length);
      }
    }, 4000); 

    return () => clearInterval(interval);
  }, [images]);

  const [cardIndex, setCardIndex] = useState(0);
  const hero = content?.hero || {};
  const cards = content?.introCards || [];

  const cardImages = hero.cardImages?.length > 0 ? hero.cardImages.map(img => `${img}?auto=format&fit=crop&q=80&w=800&fm=webp`) : [];

  useEffect(() => {
    if (cardImages.length <= 1) return;
    const interval = setInterval(() => {
      if (!document.hidden) {
        setCardIndex((prev) => (prev + 1) % cardImages.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [cardImages]);

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white relative overflow-hidden">
      
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center pt-32 pb-10">
        
        {/* Background Images */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <AnimatePresence mode="popLayout">
            {!loading && images.length > 0 ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: isDarkMode ? 0.4 : 0.7, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${images[index]})` }}
              ></motion.div>
            ) : loading ? (
              <div className="absolute inset-0 bg-white/5 animate-pulse opacity-20"></div>
            ) : null}
          </AnimatePresence>
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-[#050505]/60 to-[#050505]"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT TEXT */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
                {loading ? "Initializing System..." : user ? (
                  <span>Welcome Back, <span className="text-orange-500 font-black">{user.username || user.name}</span></span>
                ) : hero.badgeText || "Precision Engineering"}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4 mb-6">
                <SkeletonBase className="h-12 md:h-16 rounded-2xl w-3/4" />
                <SkeletonBase className="h-12 md:h-16 rounded-2xl w-1/2" />
              </div>
            ) : (
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-8 tracking-tight leading-[1.1]">
                <TypingText text={hero.heading} />
              </h1>
            )}

            {loading ? (
              <SkeletonBase className="h-20 rounded-2xl w-full mb-12" />
            ) : (
              <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-xl leading-relaxed font-light mb-12">
                {hero.subheading}
              </p>
            )}

            {/* Social Links - Pulsing Animation */}
            {content?.socialLinks && Object.values(content.socialLinks).some(link => link) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="flex flex-wrap items-center gap-3 mb-10"
              >
                {Object.entries(content.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  const Icon = {
                    youtube: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
                    instagram: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
                    linkedin: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                    x: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                    facebook: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
                    whatsapp: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.067 2.875 1.215 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.558 0 11.897-5.335 11.9-11.894a11.83 11.83 0 00-3.465-8.412Z"/></svg>
                  };
                  const PlatformIcon = Icon[platform] || Icon.instagram;
                  
                  return (
                    <motion.a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ 
                        duration: 2.5, 
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: Object.keys(content.socialLinks).indexOf(platform) * 0.2
                      }}
                      className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500/50 transition-all hover:bg-orange-500/5 shadow-lg shadow-black/20"
                      title={platform}
                    >
                      <PlatformIcon />
                    </motion.a>
                  );
                })}
              </motion.div>
            )}

            <div className="flex flex-row flex-wrap lg:flex-nowrap gap-3 md:gap-6">
              <Link to="/projects" className="group bg-orange-500 text-white px-5 md:px-7 lg:px-10 py-4 md:py-3.5 lg:py-4.5 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest transition-all duration-300 hover:bg-orange-400 shadow-[0_15px_35px_rgba(249,115,22,0.4)] flex items-center gap-2 md:gap-3 active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
              View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link to="/Prices" className="bg-white/5 border border-white/10 text-white px-5 md:px-7 lg:px-10 py-4 md:py-3.5 lg:py-4.5 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest transition-all duration-300 hover:bg-white/10 backdrop-blur-md active:scale-95 flex-1 md:flex-none justify-center whitespace-nowrap">
                affordable Pricing 
              </Link>
            </div>
          </motion.div>

          {/* RIGHT IMAGE STACK - ANIMATED */}
          <div className="flex justify-center items-center relative h-[300px] md:h-[500px] lg:h-[600px] w-full [perspective:2000px] mt-10 md:mt-0">
            <div className="relative w-full max-w-[260px] md:max-w-[380px] lg:max-w-[450px] aspect-[4/5] md:aspect-auto md:h-full">
                
                {loading ? (
                    <HeroStackSkeleton />
                ) : cardImages.length > 0 ? (
                   <AnimatePresence mode="popLayout">
                      <motion.div
                          key={cardIndex}
                          initial={{ opacity: 0, rotateY: 180, scale: 0.9 }}
                          animate={{ 
                            opacity: 1, 
                            rotateY: 0, 
                            scale: [0.9, 1.1, 1],
                            y: [0, -20, 0],
                            filter: ["blur(4px)", "blur(0px)"]
                          }}
                          exit={{ 
                              opacity: 0, 
                              rotateY: -180, 
                              scale: 0.8,
                              filter: "blur(8px)",
                              transition: { duration: 0.8 } 
                          }}
                          transition={{ 
                              opacity: { duration: 0.5 },
                              rotateY: { 
                                duration: 1.5, 
                                ease: [0.43, 0.13, 0.23, 0.96]
                              },
                              scale: {
                                duration: 1.5,
                                times: [0, 0.5, 1]
                              },
                              filter: { duration: 0.8 },
                              y: { 
                                duration: 5, 
                                repeat: Infinity, 
                                ease: "easeInOut" 
                              }
                          }}
                          className="absolute inset-0 z-10"
                          onClick={() => setCardIndex((prev) => (prev + 1) % cardImages.length)}
                      >
                          {/* Shadow Layers that rotate with the card */}
                          <div className="absolute inset-0 translate-x-4 translate-y-4 bg-white/5 border border-white/10 rounded-[3.5rem] -z-10 blur-[2px]"></div>
                          <div className="absolute inset-0 translate-x-8 translate-y-8 bg-white/[0.02] border border-white/10 rounded-[3.5rem] -z-20 blur-[4px]"></div>

                          <div className="relative h-full w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-white/20 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)] bg-[#0a0a0a] group cursor-pointer">
                              <img 
                                  src={cardImages[cardIndex] || null} 
                                  alt={`Hero Card ${cardIndex}`} 
                                  width="450"
                                  height="560"
                                  fetchPriority={cardIndex === 0 ? "high" : "auto"}
                                  loading={cardIndex === 0 ? "eager" : "lazy"}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                              
                              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Featured Asset</p>
                                  <h4 className="text-xl font-bold text-white">Advanced Solutions</h4>
                              </div>
                          </div>
                      </motion.div>
                   </AnimatePresence>
                ) : (
                    <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 border border-white/10 border-dashed flex flex-col items-center justify-center text-gray-700">
                        <Layout className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">Configure in Admin</span>
                    </div>
                )}

                {/* Decorative Glowing Orbs */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-orange-500/20 rounded-full blur-[80px] -z-30 animate-pulse"></div>
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] -z-30 animate-pulse delay-700"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CARDS SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            [1,2,3].map(i => (
                <div key={i} className="h-[400px]"><CardSkeleton /></div>
            ))
        ) : cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            animate={{ 
              borderColor: [
                "rgba(255, 255, 255, 0.1)", 
                "rgba(249, 115, 22, 0.4)", 
                "rgba(59, 130, 246, 0.2)", 
                "rgba(255, 255, 255, 0.1)"
              ] 
            }}
            transition={{ 
              delay: i * 0.1, 
              duration: 0.6,
              borderColor: { duration: 4, repeat: Infinity, ease: "linear" }
            }}
            viewport={{ once: true }}
            className="group bg-white/[0.02] p-5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.2)] flex flex-col"
          >
            <div className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl mb-8 group-hover:scale-110 group-hover:bg-orange-500/10 group-hover:border-orange-500/20 transition-all duration-500">
              <div className="text-orange-500">
                <DynamicIcon name={card.icon} className="w-8 h-8" />
              </div>
            </div>
            <h3 className="font-bold text-2xl text-white mb-4 tracking-tight group-hover:text-orange-400 transition-colors">{card.title}</h3>
            <p className="text-gray-400 text-base leading-relaxed flex-grow font-light">
              {card.description}
            </p>
          </motion.div>
        ))}
      </section>
      
    </div>
  );
}
