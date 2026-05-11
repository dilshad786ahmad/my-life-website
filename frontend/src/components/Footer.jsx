import React from "react";
import { Mail, ArrowRight, Briefcase, Share2, Users, Camera } from "lucide-react";
import { Twitter, Linkedin, Instagram } from "./BrandIcons";
import { NavLink } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#050505] text-gray-400 px-6 py-24 border-t border-white/5 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[128px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-12">
          
          {/* Brand & Socials */}
          <div className="space-y-8">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)] group-hover:scale-110 transition-transform">
                <span className="text-white font-black text-xl italic">DV</span>
              </div>
              <h1 className="text-white font-bold text-xl tracking-tight">
                Dev<span className="text-orange-500">Vision</span>
              </h1>
            </NavLink>
            
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Delivering precision-engineered digital solutions for global leaders. We bridge the gap between vision and execution.
            </p>

            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Menu */}
          <div>
            <h3 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-8">Navigation</h3>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
              {["Home", "About", "Services", "Projects", "Prices", "Contact"].map((item, i) => (
                <li key={i}>
                  <NavLink 
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-sm hover:text-orange-500 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-[1px] bg-orange-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white text-[11px] font-black tracking-[0.2em] uppercase mb-8">Legal & Privacy</h3>
            <ul className="space-y-4">
              {["Privacy Policy", "Terms of Service", "Cookie Settings", "Security"].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-sm hover:text-white transition-colors duration-300">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h3 className="text-white text-lg font-bold mb-2 relative z-10">Stay Updated</h3>
            <p className="text-gray-500 text-xs mb-6 relative z-10 leading-relaxed">
              Join our newsletter for the latest insights in tech and design.
            </p>

            <div className="space-y-3 relative z-10">
              <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-orange-500/50 transition-all">
                <Mail className="w-4 h-4 text-gray-500 mr-3" />
                <input
                  type="email"
                  placeholder="Your email"
                  className="bg-transparent outline-none text-xs flex-1 text-white placeholder-gray-600"
                />
              </div>

              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(249,115,22,0.2)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.3)]">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium tracking-wide text-gray-600 uppercase">
            © {currentYear} DevVision. Crafted with passion for the modern web.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] font-black tracking-widest text-gray-500 hover:text-white uppercase transition-colors">Status</a>
            <a href="#" className="text-[10px] font-black tracking-widest text-gray-500 hover:text-white uppercase transition-colors">Help Center</a>
            <a href="#" className="text-[10px] font-black tracking-widest text-gray-500 hover:text-white uppercase transition-colors">API Docs</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
