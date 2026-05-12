import React, { useState } from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, UserCircle, Search, Users, LogOut, Layout, Sparkles, Box, Cpu, FolderGit2, Contact, BadgeDollarSign, Settings, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function AdminHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();

  const adminLinks = [
    { name: 'Home', path: '/admin/my/home', icon: Layout },
    { name: 'About', path: '/admin/my/about', icon: UserCircle },
    { name: 'Services', path: '/admin/my/services', icon: Box },
    { name: 'Skills', path: '/admin/my/skills', icon: Cpu },
    { name: 'Projects', path: '/admin/my/projects', icon: FolderGit2 },
    { name: 'Prices', path: '/admin/my/prices', icon: BadgeDollarSign },
    { name: 'Contact', path: '/admin/my/contact', icon: Contact },
    { name: 'Feedback', path: '/admin/my/feedback', icon: Sparkles },
    { name: 'Team', path: '/admin/my/team', icon: Users },
    { name: 'Dashboard', path: '/admin', icon: Sparkles },
  ];

  const handleLogout = async () => {
    await logout();
    window.location.href = "/signin";
  };

  return (
    <header className="bg-[#050505]/80 backdrop-blur-2xl border-b border-white/10 sticky top-0 z-[100] transition-all duration-500">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-all duration-500 group-hover:rotate-3">
                <Settings className="text-white w-5 h-5 animate-spin-slow" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black text-white tracking-tighter leading-none">
                  ADMIN<span className="text-orange-500">ENGINE</span>
                </span>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-[0.2em] mt-0.5">Control Center</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0">
            {adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'} 
                className={({ isActive }) =>
                  `relative px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'text-orange-500 bg-orange-500/5'
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.username || 'Administrator'}</span>
             </div>

             <button 
                onClick={toggleTheme}
                className="p-3 bg-white/5 text-gray-400 border border-white/10 rounded-xl hover:bg-white/10 hover:text-orange-500 transition-all duration-300 shadow-lg"
                title="Toggle Theme"
             >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
             </button>

             <button 
                onClick={handleLogout}
                className="p-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg shadow-red-500/5"
             >
                <LogOut size={18} />
             </button>

             {/* Mobile Toggle */}
             <button
               onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
               className="lg:hidden p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-white/10 transition-all"
             >
               {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden absolute top-full left-0 w-full bg-[#0d0d0d] border-b border-white/10 shadow-2xl backdrop-blur-3xl p-6 space-y-2 z-50"
          >
            {adminLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/admin'}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <link.icon size={18} />
                {link.name}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
