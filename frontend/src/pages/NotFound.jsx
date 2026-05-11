import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, AlertCircle, ArrowLeft, Ghost } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NotFound = () => {
    const { isDarkMode } = useTheme();

    return (
        <div className={`min-h-screen flex items-start justify-center px-6 pt-32 md:pt-48 relative overflow-hidden ${isDarkMode ? 'bg-[#050505]' : 'bg-gray-50'}`}>
            {/* Background Decorations */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>

            <div className="max-w-2xl w-full text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {/* Icon Section */}
                    <div className="relative inline-block mb-8">
                        <motion.div
                            animate={{ y: [0, -15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="relative z-10"
                        >
                            <Ghost className={`w-32 h-32 ${isDarkMode ? 'text-orange-500' : 'text-orange-600'}`} strokeWidth={1.5} />
                        </motion.div>
                        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-4 rounded-full blur-xl ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-500/10'}`}></div>
                    </div>

                    {/* Text Content */}
                    <h1 className={`text-7xl md:text-9xl font-black mb-4 tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        4<span className="text-orange-500">0</span>4
                    </h1>
                    <h2 className={`text-2xl md:text-3xl font-bold mb-6 tracking-tight ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        Oops! Page Not Found
                    </h2>
                    <p className={`text-lg mb-10 max-w-md mx-auto leading-relaxed ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                        The page you're looking for doesn't exist or has been moved. 
                        Don't worry, even the best explorers get lost sometimes.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <NavLink to="/">
                            <button className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(249,115,22,0.3)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.4)] hover:-translate-y-1 active:translate-y-0 group">
                                <Home className="w-4 h-4" />
                                Go Back Home
                            </button>
                        </NavLink>
                        <button 
                            onClick={() => window.history.back()}
                            className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border group ${
                                isDarkMode 
                                ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                                : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Previous Page
                        </button>
                    </div>
                </motion.div>

                {/* Fun Fact */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-16 flex items-center justify-center gap-2"
                >
                    <div className={`w-10 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Lost in the Void
                    </p>
                    <div className={`w-10 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}></div>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFound;
