import React, { useEffect, useState } from "react";
import { Code, Database, Cloud, PenTool, Box, Server, Cpu, Users, MessageCircle, Clock, ArrowRight, Layout } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import Breadcrumb from "../components/Breadcrumb";
import { SkeletonBase } from "../components/Skeleton";

const IconMap = { Code, Database, Cloud, PenTool, Box, Server, Cpu, Users, MessageCircle, Clock, Layout };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function SkillsSection() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://my-life-website.onrender.com/api/skillspage");
        setContent(res.data.data);
      } catch (error) {
        console.error("Error fetching skills content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => fetchData());
    } else {
      fetchData();
    }
  }, []);

  const header = content?.header || {
    badgeText: "Our Expertise",
    title: "Technical Arsenal",
    description: "Architecting robust solutions with a modern technology stack. From frontend interactivity to scalable backend systems."
  };
  const skills = content?.technicalSkills || [];
  const softSkills = content?.softSkills || [];
  const cta = content?.cta || {
    title: "Looking for a specific skill?",
    description: "I'm always learning new technologies. Let's discuss how I can adapt."
  };
  const codeBox = content?.codeBox || {
    code: 'const developer = {\n  name: "Pro Portfolio",\n  role: "Full Stack Engineer",\n  skills: ["React", "Node", "Cloud"],\n  readyForWork: true\n};'
  };

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white relative overflow-hidden pt-32 pb-20">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Breadcrumb />

        {/* Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">
              {loading ? "Linking Infrastructure..." : header.badgeText}
            </span>
          </div>

          {loading ? (
            <div className="h-12 md:h-16 w-3/4 bg-white/5 rounded-2xl animate-pulse mb-6"></div>
          ) : (
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tighter leading-[1.1]">
                {header.title}
            </h2>
          )}

          {loading ? (
            <div className="h-10 w-1/2 bg-white/5 rounded-xl animate-pulse"></div>
          ) : (
            <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-light">
                {header.description}
            </p>
          )}
        </motion.div>

        {/* Skill Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {loading ? (
              [1,2,3,4].map(i => (
                  <SkeletonBase key={i} className="h-40 bg-white/5 rounded-3xl" />
              ))
          ) : skills.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="group bg-white/[0.02] border border-white/10 rounded-3xl p-6 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/20 backdrop-blur-md hover:-translate-y-2 hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.15)] cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-14 h-14 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                <div className="text-orange-400"><DynamicIcon name={item.icon} className="w-7 h-7" /></div>
              </div>
              <h3 className="font-bold text-xl text-white mb-2 tracking-tight">{item.name}</h3>
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest group-hover:text-gray-400 transition-colors">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Soft Skills */}
        <div className="text-center mb-16 flex flex-col items-center">
          <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Interpersonal Strength</h2>
          <div className="w-20 h-1 bg-orange-500/20 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32">
          {softSkills.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/20 backdrop-blur-md hover:-translate-y-1 cursor-pointer"
            >
              <div className="text-blue-400 group-hover:scale-110 group-hover:rotate-6 transition-all"><DynamicIcon name={item.icon} className="w-6 h-6" /></div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">{item.name}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden bg-[#0a0a0a]/50 border border-white/10 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 shadow-2xl backdrop-blur-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex-1">
            <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tighter leading-tight">{cta.title}</h3>
            <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed font-light">
              {cta.description}
            </p>

            <div className="flex flex-wrap gap-5">
              <button className="bg-orange-500 text-white px-6 md:px-7 lg:px-8 py-3.5 md:py-3.5 lg:py-4 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest hover:bg-orange-400 transition-all duration-300 shadow-[0_10px_30px_rgba(249,115,22,0.3)] flex items-center gap-2">
                Get In Touch <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-6 md:px-7 lg:px-8 py-3.5 md:py-3.5 lg:py-4 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
                Download CV
              </button>
            </div>
          </div>

          {/* Code Box */}
          <div className="relative z-10 w-full md:w-[450px] bg-[#050505] border border-white/10 p-8 rounded-[2rem] shadow-2xl font-mono text-sm leading-relaxed overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500/50 to-blue-500/50"></div>
            <div className="flex gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/40"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
            </div>
            <pre className="text-gray-300 font-light overflow-x-auto custom-scrollbar">
              {codeBox.code.split('\n').map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="w-8 text-gray-700 select-none mr-4 text-right">{idx + 1}</span>
                  <code dangerouslySetInnerHTML={{ __html: line.replace(/"(.*?)"/g, '<span className="text-green-400">"$1"</span>').replace(/\b(const|let|var|function|return)\b/g, '<span className="text-purple-400">$1</span>').replace(/\b(true|false|null)\b/g, '<span className="text-orange-400">$1</span>') }} />
                </div>
              ))}
            </pre>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
