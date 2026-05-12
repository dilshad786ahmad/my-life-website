import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { Twitter, Linkedin, Instagram } from '../components/BrandIcons';
import { Link, useNavigate } from 'react-router-dom';
import { CardSkeleton } from '../components/Skeleton';
import { useTheme } from '../context/ThemeContext';

const Team = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const response = await axios.get('https://my-life-website.onrender.com/api/team');
                setTeam(response.data);
            } catch (error) {
                console.error("Error fetching team members:", error);
            } finally {
                setLoading(false);
            }
        };

        if (window.requestIdleCallback) {
            window.requestIdleCallback(() => fetchTeam());
        } else {
            fetchTeam();
        }
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: 'spring',
                stiffness: 100
            }
        }
    };

    return (
        <section className="py-20 px-6 relative overflow-hidden font-sans bg-[#050505] text-white">
            {/* Background ambient glows */}
            <div className={`absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-200/20'}`}></div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                
                {/* Heading */}
                <div className="mb-16 flex flex-col items-center">
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-md bg-white/5"
                    >
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
                        <span className={`text-[10px] font-bold tracking-[0.2em] uppercase ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            Leadership
                        </span>
                    </motion.div>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight text-white"
                    >
                        Our Team
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light text-gray-400"
                    >
                        Meet the talented individuals driving innovation and shaping the future of our digital experiences.
                    </motion.p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[450px]">
                                <CardSkeleton />
                            </div>
                        ))}
                    </div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {team.map((member) => (
                            <motion.div
                                key={member._id}
                                variants={itemVariants}
                                whileHover={{ y: -10 }}
                                className="group rounded-3xl overflow-hidden transition-all duration-500 backdrop-blur-xl flex flex-col text-left bg-[#0a0a0a] hover:shadow-[0_15px_40px_-10px_rgba(59,130,246,0.15)]"
                            >
                                {/* Image */}
                                <div className="overflow-hidden h-56 relative">
                                    <div className="absolute inset-0 z-10 opacity-80 group-hover:opacity-60 transition-opacity bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                                    <img
                                        src={`${member.image}${member.image.includes('?') ? '&' : '?'}auto=format&fit=crop&q=80&w=600&fm=webp`}
                                        alt={member.name}
                                        width="400"
                                        height="300"
                                        loading="lazy"
                                        className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                                    />
                                    {/* Social icons overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-4 group-hover:translate-x-0 transition-transform">
                                        {member.socialLinks?.linkedin && (
                                            <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-600 text-white shadow-lg">
                                                <Linkedin size={18} />
                                            </a>
                                        )}
                                        {member.socialLinks?.twitter && (
                                            <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-sky-500 text-white shadow-lg">
                                                <Twitter size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-grow relative z-20">
                                    <h3 className="text-2xl font-bold mb-1 transition-colors text-white group-hover:text-blue-400">
                                        {member.name}
                                    </h3>

                                    <p className="text-orange-500 text-xs font-black tracking-widest uppercase mb-4">
                                        {member.role}
                                    </p>

                                    <p className="text-sm leading-relaxed flex-grow mb-8 line-clamp-3 text-gray-400">
                                        {member.bio}
                                    </p>

                                    {/* Button */}
                                    <button 
                                        onClick={() => navigate(`/team/${member._id}`)}
                                        className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex justify-center items-center gap-2 group/btn bg-[#0d0d0d] text-white hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                                    >
                                        View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
                
                {!loading && team.length === 0 && (
                    <div className="py-20">
                        <p className="text-gray-500 italic">No team members added yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Team;
