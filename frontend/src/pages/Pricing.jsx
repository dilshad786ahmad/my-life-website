import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, Asterisk, Layers, Rocket, Code, Layout, AppWindow, ArrowRight, Zap, Globe, Shield } from 'lucide-react';
import Breadcrumb from "../components/Breadcrumb";
import { CardSkeleton } from "../components/Skeleton";
import { API_BASE_URL } from "../apiConfig";

const IconMap = { Asterisk, Layers, Rocket, Code, Layout, AppWindow, Zap, Globe, Shield };
const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

export default function PricingPage() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/pricingpage`);
        setContent(res.data.data);
      } catch (error) {
        console.error("Failed to load pricing content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  // Fallbacks
  const header = content?.header || {
    title: "Transparent & Scalable Pricing",
    subtitle: "Premium digital experiences built with precision. We offer structured packages designed to grow alongside your business objectives, ensuring maximum value at every stage.",
    highlightText: ""
  };
  const basicPlans = content?.basicPlans || [];
  const standardSolutions = content?.standardSolutions || [];
  const enterpriseSystems = content?.enterpriseSystems || [];

  return (
    <div className="bg-[#050505] min-h-screen pt-32 pb-16 px-4 font-sans text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[128px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb />

        {/* HEADER */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-300 uppercase">
              {loading ? "Syncing Rates..." : "Pricing Plans"}
            </span>
          </div>
          {loading ? (
            <div className="h-14 w-3/4 bg-white/5 rounded-2xl animate-pulse mb-6"></div>
          ) : (
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight">
                {header.title}
            </h1>
          )}
          {loading ? (
            <div className="h-10 w-1/2 bg-white/5 rounded-xl animate-pulse"></div>
          ) : (
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
                {header.subtitle}
                {header.highlightText && (
                   <span className="text-orange-400 font-medium block mt-2">{header.highlightText}</span>
                )}
            </p>
          )}
        </div>

        {/* BASIC PLANS */}
        <div className="mb-20">
            {loading ? (
                <div className="grid md:grid-cols-3 gap-8">
                    {[1,2,3].map(i => (
                        <div key={i} className="h-[500px]"><CardSkeleton /></div>
                    ))}
                </div>
            ) : basicPlans.length > 0 && (
                <>
                <div className="flex items-center justify-center mb-12">
                  <h2 className="text-3xl font-bold text-white tracking-tight">Basic Options</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                  {basicPlans.map((plan) => (
                    <div
                      key={plan._id || plan.title}
                      className={`group relative rounded-3xl p-8 transition-all duration-500 flex flex-col ${
                        plan.highlight 
                          ? "bg-gradient-to-b from-white/10 to-white/5 border border-orange-500/50 shadow-[0_0_40px_-10px_rgba(249,115,22,0.3)] scale-105 z-10" 
                          : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20"
                      } backdrop-blur-xl`}
                    >
                      {plan.highlight && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                          <span className="text-[10px] font-bold tracking-widest bg-gradient-to-r from-orange-600 to-orange-400 text-white px-4 py-1.5 rounded-full shadow-lg">
                            MOST POPULAR
                          </span>
                        </div>
                      )}

                      <h3 className="text-sm font-semibold text-gray-400 tracking-widest uppercase mb-2">{plan.title}</h3>

                      <div className="flex items-end gap-1 mb-4">
                        <p className="text-3xl sm:text-5xl font-bold text-white">{plan.price}</p>
                        <span className="text-sm font-medium text-gray-500 mb-1">{plan.suffix}</span>
                      </div>

                      <p className="text-sm text-gray-400 leading-relaxed mb-8 flex-grow">
                        {plan.desc}
                      </p>

                      <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

                      <ul className="space-y-4 text-sm text-gray-300 font-medium mb-10">
                        {plan.features?.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 shrink-0 ${plan.highlight ? "text-orange-400" : "text-gray-500"}`} />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>

                      <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 ${
                        plan.highlight 
                          ? "bg-orange-500 text-white hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]" 
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}>
                        Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
                </>
            )}
        </div>

        {/* BUILT FOR PERFORMANCE */}
        <div className="relative rounded-3xl overflow-hidden mb-24 border border-white/10 bg-[#0a0a0a]/50 backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-blue-500/10 pointer-events-none"></div>
          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            <div className="p-10 relative overflow-hidden group">
               <div className="relative z-10">
                 <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                   UI/UX Design<br/><span className="text-gray-400">Built for scale</span>
                 </h2>
                 <p className="text-sm text-gray-400 leading-relaxed mb-8">
                   Our engineering team ensures every line of code is optimized for speed, security, and scalability from day one.
                 </p>
                 <button className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition flex items-center gap-2">
                   Service Details <ArrowRight className="w-4 h-4" />
                 </button>
               </div>
               <Layout className="absolute -bottom-6 -right-6 w-48 h-48 text-white/[0.02] group-hover:text-orange-500/[0.05] group-hover:scale-110 transition-all duration-700" />
            </div>

            <div className="p-10 group relative overflow-hidden hover:bg-white/[0.02] transition-colors">
              <Code className="w-8 h-8 text-orange-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Web Development</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                Building robust, scalable, and performant web applications using modern technologies and best practices.
              </p>
              <button className="text-white text-sm font-semibold hover:text-orange-400 transition flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="p-10 group relative overflow-hidden hover:bg-white/[0.02] transition-colors">
              <AppWindow className="w-8 h-8 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Brand Identity</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-8">
                Developing cohesive visual systems that communicate your core values and resonate with your target audience.
              </p>
              <button className="text-white text-sm font-semibold hover:text-blue-400 transition flex items-center gap-2">
                Learn More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* STANDARD SOLUTIONS */}
        {standardSolutions.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center justify-center mb-12">
              <h2 className="text-3xl font-bold text-white tracking-tight">Standard Solutions</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {standardSolutions.map((item) => (
                <div key={item._id || item.title} className="group bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500 flex flex-col backdrop-blur-md hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10">
                  <div className="h-48 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10"></div>
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  </div>
                  
                  <div className="p-8 flex-grow flex flex-col relative z-20 -mt-10">
                    <h3 className="text-xs font-bold text-orange-400 tracking-widest uppercase mb-2">{item.title}</h3>
                    
                    <div className="mb-6">
                      <p className="text-2xl sm:text-4xl font-bold text-white">{item.price}</p>
                    </div>

                    <div className="w-full h-px bg-white/10 mb-6"></div>

                    <ul className="space-y-4 text-sm text-gray-300 font-medium mb-8 flex-grow">
                      {item.features?.map((f, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-gray-500 shrink-0 group-hover:text-white transition-colors" /> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <button className="w-full border border-white/20 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-white hover:text-black transition-all duration-300">
                      Select {item.title.charAt(0).toUpperCase() + item.title.slice(1).toLowerCase()}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADVANCED ENTERPRISE SYSTEMS */}
        {enterpriseSystems.length > 0 && (
          <div className="mb-24">
            <div className="flex items-center justify-center mb-12">
              <h2 className="text-3xl font-bold text-white tracking-tight">Enterprise Systems</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {enterpriseSystems.map((sys) => (
                <div
                  key={sys._id || sys.title}
                  className={`group rounded-3xl p-8 transition-all duration-500 relative overflow-hidden flex flex-col ${
                    sys.highlight 
                    ? "bg-gradient-to-br from-orange-600 to-orange-800 border border-orange-500 shadow-2xl shadow-orange-900/50" 
                    : "bg-white/[0.02] border border-white/10 hover:bg-white/[0.04]"
                  }`}
                >
                  {sys.highlight && (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                  )}
                  
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${sys.highlight ? "bg-white/20 text-white shadow-inner" : "bg-white/5 text-gray-400 border border-white/10"}`}>
                      <DynamicIcon name={sys.icon} className="w-6 h-6" />
                    </div>
                    <p className="text-2xl sm:text-4xl font-bold">{sys.price}</p>
                  </div>

                  <h3 className="font-bold text-xl mb-3 text-white">{sys.title}</h3>
                  <p className={`text-sm leading-relaxed mb-8 flex-grow ${sys.highlight ? "text-orange-100" : "text-gray-400"}`}>
                    {sys.desc}
                  </p>

                  <ul className={`space-y-4 text-sm font-medium mb-10 ${sys.highlight ? "text-white" : "text-gray-300"}`}>
                    {sys.features?.map((f, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${sys.highlight ? "text-orange-200" : "text-gray-600"}`} /> 
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={`w-full py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    sys.highlight 
                      ? "bg-white text-orange-600 hover:bg-gray-100 shadow-lg" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}>
                    Contact Sales
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FOOTER TEXT */}
        <div className="text-center mt-32 mb-8">
          <div className="inline-block px-6 py-3 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-sm">
            <p className="text-xs text-gray-500 font-medium tracking-wide">
              Final pricing may be adjusted based on specific requirements and scale.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
