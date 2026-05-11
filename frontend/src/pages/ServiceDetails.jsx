import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Layout, Monitor, Code, Box, Zap, Cpu, MousePointer2, Database, ArrowRight, Sparkles } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

import { SkeletonBase, TextSkeleton } from "../components/Skeleton";

const IconMap = { Layout, Monitor, Code, Box, Zap, Cpu, MousePointer2, Database };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function ServiceDetails() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/servicedetails/${serviceId}`);
        setDetails(res.data.data);
      } catch (error) {
        console.error("Error fetching service details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [serviceId]);

  const handleConsultClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to schedule a consultation");
      navigate("/signin", { state: { from: "/contact" } });
      return;
    }
    navigate("/contact");
  };

  if (loading) {
    return (
      <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans pt-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex gap-4 mb-10">
            <SkeletonBase className="h-4 w-20 rounded-full" />
            <SkeletonBase className="h-4 w-20 rounded-full" />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <SkeletonBase className="h-8 w-40 rounded-full" />
              <TextSkeleton lines={2} className="w-full h-20" />
              <SkeletonBase className="h-2 w-20 rounded-full" />
              <TextSkeleton lines={3} className="w-full h-24" />
              <div className="flex gap-4">
                <SkeletonBase className="h-14 w-40 rounded-2xl" />
                <SkeletonBase className="h-14 w-40 rounded-2xl" />
              </div>
            </div>
            <SkeletonBase className="h-[500px] w-full rounded-[3rem]" />
          </div>

          <div className="mt-32 space-y-12">
            <SkeletonBase className="h-8 w-64 rounded-full mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[1,2,3,4].map(i => (
                <SkeletonBase key={i} className="h-64 rounded-[2.5rem]" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback data if none found in DB (to match the image UI)
  const data = details || {
    title: "Elite UI/UX Design for Digital Excellence",
    description: "We craft intuitive, engaging, and beautiful digital experiences that resonate with your users. Our methodology combines analytical research with creative precision to deliver products that perform.",
    mainImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop",
    breadcrumb: "Home > Services > UI/UX Design",
    subTitle: "OUR TECHNOLOGY ECOSYSTEM",
    subHeading: "Integrated Product Design",
    features: [
      { title: "Figma Mastery", description: "Industry-leading collaborative design using advanced component systems and prototyping.", icon: "Layout" },
      { title: "System Logic", description: "Scalable design systems that bridge the gap between creative vision and technical implementation.", icon: "Cpu" },
      { title: "Interaction", description: "Advanced motion design and Framer integration for high-fidelity interactive prototypes.", icon: "MousePointer2" },
      { title: "Data Research", description: "User testing and analytical tools to validate every design decision with real-world metrics.", icon: "Database" }
    ]
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans transition-colors duration-500">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-600/[0.07] rounded-full blur-[120px] -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-blue-600/[0.05] rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-orange-500/[0.02] rounded-full blur-[150px] -z-10 pointer-events-none rotate-45"></div>

      {/* Navbar Spacing */}
      <div className="h-28 md:h-24"></div>

      {/* Hero Section */}
     

      {/* Features Grid Section */}
      <section className="py-40 relative z-10">
        <div className="absolute inset-0 bg-white/[0.01] -skew-y-3 -z-10 border-y border-white/5"></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <div className="flex flex-col items-center mb-24 text-center">
             <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-8 border border-orange-500/20">
                <Cpu className="text-orange-500 w-8 h-8" />
             </div>
            <h2 className="text-4xl lg:text-7xl font-black text-white italic tracking-tighter mb-6 leading-none">
              {data.subHeading}
            </h2>
            <p className="text-gray-500 max-w-xl text-lg font-light tracking-wide">
               Exploiting the synergy between visionary design and technical prowess to build future-proof solutions.
            </p>
            <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-12"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="group bg-[#0d0d0d]/40 border border-white/5 p-12 rounded-[3rem] shadow-2xl hover:border-orange-500/40 transition-all duration-500 text-left relative overflow-hidden backdrop-blur-md"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-orange-500 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-700"></div>
                
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-10 group-hover:bg-orange-500 group-hover:shadow-[0_20px_40px_-10px_rgba(249,115,22,0.5)] transition-all duration-700 group-hover:-translate-y-2">
                  <DynamicIcon name={feature.icon} className="w-10 h-10 text-orange-500 group-hover:text-white transition-colors duration-700" />
                </div>
                
                <h3 className="text-2xl font-black text-white mb-6 tracking-tight italic group-hover:text-orange-500 transition-colors">{feature.title}</h3>
                <p className="text-gray-500 text-base md:text-lg font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-500">
                  {feature.description}
                </p>
                
                <div className="mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 text-orange-500 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                   Learn Depth <ChevronRight size={12} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
