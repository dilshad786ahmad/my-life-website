import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import { TextSkeleton, SkeletonBase } from "../components/Skeleton";

export default function DynamicPage() {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`https://my-life-website.onrender.com/api/pages/${slug}`);
        setPageData(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load page content", error);
        setPageData(null);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans pt-40 px-6">
        <div className="max-w-5xl mx-auto text-center mb-32">
          <SkeletonBase className="h-8 w-32 rounded-full mx-auto mb-8" />
          <TextSkeleton lines={2} className="w-3/4 mx-auto mb-8 h-16" />
          <TextSkeleton lines={1} className="w-1/2 mx-auto h-6" />
        </div>
        <div className="max-w-6xl mx-auto space-y-40">
          {[1, 2].map((i) => (
            <div key={i} className={`flex flex-col md:flex-row gap-20 items-center ${i % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
              <div className="flex-1 space-y-8 w-full">
                <SkeletonBase className="w-12 h-1 rounded-full" />
                <TextSkeleton lines={1} className="w-3/4 h-12" />
                <TextSkeleton lines={3} />
                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                  <SkeletonBase className="h-16 rounded-2xl" />
                  <SkeletonBase className="h-16 rounded-2xl" />
                </div>
              </div>
              <div className="flex-1 w-full">
                <SkeletonBase className="aspect-video rounded-[2.5rem]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white px-6">
        <h1 className="text-6xl font-black mb-4 tracking-tighter">404</h1>
        <p className="text-gray-500 mb-8 uppercase tracking-[0.3em] text-xs font-black">Page Not Found</p>
        <Link to="/" className="bg-white/5 border border-white/10 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      {/* HERO SECTION */}
      <div className="relative pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
              Exclusive Insights
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 leading-[1.1] tracking-tighter"
          >
            {pageData.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed"
          >
            {pageData.heroSubtitle}
          </motion.p>
        </div>
      </div>

      {/* DYNAMIC SECTIONS */}
      <div className="max-w-6xl mx-auto px-6 py-20 space-y-40">
        {pageData.sections?.map((section, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div 
              key={section._id || index} 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className={`flex flex-col md:flex-row gap-20 items-center ${isEven ? "" : "md:flex-row-reverse"}`}
            >
              
              {/* Text Content */}
              <div className="flex-1 space-y-8">
                <div className="w-12 h-1 bg-orange-500 rounded-full"></div>
                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">{section.heading}</h2>
                <p className="text-lg text-gray-400 leading-relaxed font-light">
                  {section.paragraph}
                </p>
                {section.features && section.features.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-8">
                    {section.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/30 transition-colors">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                        <span className="text-sm font-medium text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Image Content */}
              {section.image && (
                <div className="flex-1 w-full relative">
                  <div className="absolute -inset-4 bg-orange-500/10 rounded-[3rem] blur-2xl opacity-50"></div>
                  <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video">
                    <img src={section.image} alt={section.heading} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent"></div>
                  </div>
                </div>
              )}

            </motion.div>
          );
        })}
      </div>

      {/* BOTTOM CTA */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-40 mb-32 text-center px-6"
      >
        <div className="max-w-4xl mx-auto bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 rounded-[3rem] p-16 md:p-24 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -z-10 group-hover:bg-orange-500/20 transition-colors duration-500"></div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter italic">Ready to start your <br/> next big thing?</h2>
          <Link to="/contact" className="inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-5 rounded-2xl shadow-[0_10px_30px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_40px_rgba(249,115,22,0.4)] hover:-translate-y-1 transition-all duration-300 uppercase text-xs tracking-widest">
            Let's build it together <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
