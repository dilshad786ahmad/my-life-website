import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Code, Palette, Monitor, ArrowRight, Layout, Box } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import ExcellenceSection from "./Excellenace";
import axios from "axios";
import { motion } from "framer-motion";
import { CardSkeleton, SkeletonBase, TextSkeleton } from "../components/Skeleton";

const IconMap = { Palette, Code, Monitor, Layout, Box };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function WhatIOffer() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://my-life-website.onrender.com/api/servicespage");
        setContent(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const header = content?.header || {
    badgeText: "Our Expertise",
    heading: "What I Offer",
    description: "Delivering high-quality digital solutions tailored to your business needs."
  };

  const services = content?.services || [];

  return (
  <div className="bg-[#050505] text-white relative overflow-hidden font-sans">
    {/* Background ambient glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

    <div className="pt-20 pb-4 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 mt-10 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
              {loading ? "Syncing Solutions..." : header.badgeText}
            </span>
          </div>

          {loading ? (
            <SkeletonBase className="h-12 md:h-16 w-3/4 rounded-2xl mb-6" />
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight leading-[1.1]">
                {header.heading}
            </h1>
          )}

          {loading ? (
            <SkeletonBase className="h-10 w-1/2 rounded-xl" />
          ) : (
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                {header.description}
            </p>
          )}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {loading ? (
              [1,2,3].map(i => (
                  <div key={i} className="h-[400px]"><CardSkeleton /></div>
              ))
          ) : services.map((service, index) => (
            <motion.div
              key={index}
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
                delay: index * 0.1, 
                duration: 0.6,
                borderColor: { duration: 4, repeat: Infinity, ease: "linear" }
              }}
              viewport={{ once: true }}
              className="group bg-white/[0.02] rounded-3xl p-8 border border-white/10 backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.2)] flex flex-col relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                <DynamicIcon name={service.icon} className={`w-8 h-8 ${service.iconColor || 'text-orange-400'}`} />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow font-light">
                {service.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 mb-10 flex-wrap">
                {service.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-black tracking-widest uppercase bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-lg group-hover:border-white/20 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Button */}
              <Link 
                to={`/service_details/${service._id}`}
                className="w-full bg-white/5 border border-white/10 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)] flex justify-center items-center gap-2 group/btn"
              >
                Service Details <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>

    <div className="relative z-10 border-t border-white/10 bg-[#0a0a0a]/50 backdrop-blur-md">
      <ExcellenceSection/>
    </div>
  </div>
  );
}
