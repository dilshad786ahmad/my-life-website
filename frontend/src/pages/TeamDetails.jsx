import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowLeft, Loader2, Sparkles, User, Briefcase, Info, Code, CheckCircle, Award, ExternalLink } from 'lucide-react';
import { Twitter, Linkedin, Instagram } from '../components/BrandIcons';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SkeletonBase, TextSkeleton } from '../components/Skeleton';
import toast from 'react-hot-toast';

const TeamDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            toast.error("Please sign in to view member details");
            navigate('/signin', { state: { from: location.pathname } });
            return;
        }

        const fetchMember = async () => {
            try {
                const response = await axios.get(`https://my-life-website.onrender.com/api/team/${id}`);
                setMember(response.data);
            } catch (error) {
                console.error("Error fetching team member details:", error);
                toast.error("Failed to fetch member details");
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id, user, navigate, location]);

    if (loading) {
        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
                <div className="max-w-5xl mx-auto">
                    <div className="flex flex-col md:flex-row gap-12">
                        <SkeletonBase className="h-96 w-full md:w-1/3 rounded-2xl" />
                        <div className="flex-1 space-y-6">
                            <SkeletonBase className="h-10 w-3/4 rounded-lg" />
                            <SkeletonBase className="h-6 w-1/4 rounded-lg" />
                            <div className="pt-8">
                                <TextSkeleton lines={3} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!member) return null;

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-[#050505] text-white">
            <div className="max-w-5xl mx-auto">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/services')} // User mentioned team is in services or separate page, I'll link back to team if I create it
                    className="flex items-center space-x-2 mb-12 font-semibold transition-colors text-gray-400 hover:text-white"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Team</span>
                </motion.button>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                    {/* Image Section */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="md:col-span-5 lg:col-span-4"
                    >
                        <div className="sticky top-24">
                            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                                <img 
                                    src={member.image} 
                                    alt={member.name}
                                    className="w-full h-auto object-cover aspect-[4/5]"
                                />
                                <div className="absolute top-4 right-4">
                                    <div className="bg-blue-600 text-white p-2 rounded-xl shadow-lg">
                                        <Sparkles size={20} className="animate-pulse" />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 p-6 rounded-2xl bg-[#0a0a0a]">
                                <h4 className="text-sm font-black uppercase tracking-widest text-blue-500 mb-6">Contact Info</h4>
                                <div className="space-y-4">
                                    {member.email && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Mail className="text-gray-400" size={18} />
                                            <span>{member.email}</span>
                                        </div>
                                    )}
                                    {member.phone && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <Phone className="text-gray-400" size={18} />
                                            <span>{member.phone}</span>
                                        </div>
                                    )}
                                    {member.location && (
                                        <div className="flex items-center space-x-3 text-sm">
                                            <MapPin className="text-gray-400" size={18} />
                                            <span>{member.location}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex space-x-4 mt-8 pt-6">
                                    {member.socialLinks?.twitter && (
                                        <a href={member.socialLinks.twitter} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                                            <Twitter size={20} />
                                        </a>
                                    )}
                                    {member.socialLinks?.linkedin && (
                                        <a href={member.socialLinks.linkedin} className="p-2 rounded-lg bg-blue-600/10 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                                            <Linkedin size={20} />
                                        </a>
                                    )}
                                    {member.socialLinks?.instagram && (
                                        <a href={member.socialLinks.instagram} className="p-2 rounded-lg bg-pink-500/10 text-pink-500 hover:bg-pink-500 hover:text-white transition-all">
                                            <Instagram size={20} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="md:col-span-7 lg:col-span-8"
                    >
                        <div className="mb-8">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest mb-4">
                                {member.role}
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
                                {member.name}
                            </h1>
                        </div>

                        <div className="space-y-12">
                            {/* Bio */}
                             <section>
                                <div className="flex items-center space-x-2 mb-6">
                                    <Info className="text-blue-500" size={24} />
                                    <h3 className="text-2xl font-bold italic">Biography</h3>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-400 mb-8">
                                    {member.bio}
                                </p>

                                {member.achievements && member.achievements.length > 0 && (
                                    <div className="space-y-4 bg-white/5 p-6 rounded-2xl">
                                        <h4 className="text-sm font-black uppercase tracking-widest text-orange-500 mb-2">Key Achievements</h4>
                                        <div className="grid grid-cols-1 gap-3">
                                            {member.achievements.map((achievement, index) => (
                                                <div key={index} className="flex items-start space-x-3">
                                                    <CheckCircle className="text-orange-500 shrink-0 mt-0.5" size={16} />
                                                    <p className="text-gray-300 text-sm leading-relaxed">{achievement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Skills */}
                            {member.skills && member.skills.length > 0 && (
                                <section>
                                    <div className="flex items-center space-x-2 mb-6">
                                        <Code className="text-blue-500" size={24} />
                                        <h3 className="text-2xl font-bold italic">Expertise</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {member.skills.map((skill, index) => (
                                            <span 
                                                key={index}
                                                className="px-4 py-2 rounded-xl text-sm font-bold bg-[#0d0d0d] text-gray-300"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                             {/* Achievement Card Placeholder */}
                            <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-4">Core Philosophy</h3>
                                    <p className="text-blue-100 italic text-lg">
                                        "Excellence is not a skill, it's an attitude. We strive to push the boundaries of what's possible in the digital realm, every single day."
                                    </p>
                                </div>
                                <div className="absolute -bottom-10 -right-10 opacity-20 transform rotate-12">
                                    <Sparkles size={200} />
                                </div>
                            </div>

                            {/* Projects Section */}
                            {member.projects && member.projects.length > 0 && (
                                <section className="pt-8">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center space-x-2">
                                            <Award className="text-blue-500" size={24} />
                                            <h3 className="text-2xl font-bold italic">Recent Projects</h3>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {member.projects.map((project, index) => (
                                            <motion.div 
                                                key={index}
                                                whileHover={{ y: -5 }}
                                                className="group bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-xl flex flex-col"
                                            >
                                                <div className="relative h-48 overflow-hidden">
                                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                                                </div>
                                                <div className="p-6 flex-1 flex flex-col">
                                                    <h4 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h4>
                                                    <p className="text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{project.description}</p>
                                                    {project.link && (
                                                        <a 
                                                            href={project.link} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="flex items-center text-blue-500 text-xs font-black uppercase tracking-widest gap-2 hover:text-blue-400 transition-colors"
                                                        >
                                                            View Project <ExternalLink size={14} />
                                                        </a>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
