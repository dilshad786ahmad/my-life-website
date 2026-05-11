import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Image, Mail, Phone, MapPin, User, Briefcase, PlusCircle, MinusCircle } from 'lucide-react';
import { Twitter, Linkedin, Instagram } from '../components/BrandIcons';
import toast from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminTeam = () => {
    const { isDarkMode } = useTheme();
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const initialFormState = {
        name: '',
        role: '',
        image: '',
        bio: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            linkedin: '',
            instagram: ''
        },
        skills: [],
        achievements: [],
        projects: [],
        email: '',
        phone: '',
        location: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);
    const [newSkill, setNewSkill] = useState('');
    const [newAchievement, setNewAchievement] = useState('');
    const [newProject, setNewProject] = useState({ title: '', description: '', image: '', link: '', file: null });
    const [profileFile, setProfileFile] = useState(null);

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            toast.error("Access Denied: This is only for admin!");
            navigate('/');
            return;
        }
        fetchTeam();
    }, [user, navigate]);

    const fetchTeam = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/team');
            setTeam(response.data);
        } catch (error) {
            toast.error("Failed to fetch team members");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const addSkill = () => {
        if (newSkill.trim()) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (index) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((_, i) => i !== index)
        }));
    };

    const addAchievement = () => {
        if (newAchievement.trim()) {
            setFormData(prev => ({
                ...prev,
                achievements: [...prev.achievements, newAchievement.trim()]
            }));
            setNewAchievement('');
        }
    };

    const removeAchievement = (index) => {
        setFormData(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index)
        }));
    };

    const handleEditAchievement = (index) => {
        setNewAchievement(formData.achievements[index]);
        removeAchievement(index);
    };

    const addProject = () => {
        if (newProject.title.trim() && (newProject.file || newProject.image)) {
            setFormData(prev => ({
                ...prev,
                projects: [...prev.projects, { ...newProject, hasNewImage: !!newProject.file }]
            }));
            setNewProject({ title: '', description: '', image: '', link: '', file: null });
        } else {
            toast.error("Project title and image are required");
        }
    };

    const removeProject = (index) => {
        setFormData(prev => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index)
        }));
    };

    const handleEditProject = (index) => {
        const project = formData.projects[index];
        setNewProject({
            title: project.title,
            description: project.description,
            link: project.link || '',
            image: project.image || '',
            file: null
        });
        removeProject(index);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        
        // Append simple fields
        data.append('name', formData.name);
        data.append('role', formData.role);
        data.append('bio', formData.bio);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('location', formData.location);
        
        // Append complex fields as JSON strings
        data.append('socialLinks', JSON.stringify(formData.socialLinks));
        data.append('skills', JSON.stringify(formData.skills));
        data.append('achievements', JSON.stringify(formData.achievements));

        // Append profile image
        if (profileFile) {
            data.append('image', profileFile);
        } else {
            data.append('image', formData.image);
        }

        // Handle Projects and Project Images
        const projectsWithFlags = formData.projects.map(p => ({
            title: p.title,
            description: p.description,
            image: p.image,
            link: p.link,
            hasNewImage: p.hasNewImage
        }));
        data.append('projects', JSON.stringify(projectsWithFlags));

        formData.projects.forEach(p => {
            if (p.file) {
                data.append('projectImages', p.file);
            }
        });

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/team/${editingId}`, data, { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Member updated successfully");
            } else {
                await axios.post('http://localhost:5000/api/team', data, { 
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Member added successfully");
            }
            fetchTeam();
            resetForm();
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed");
        }
    };

    const handleEdit = (member) => {
        setFormData(member);
        setEditingId(member._id);
        setIsAdding(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this member?")) {
            try {
                await axios.delete(`http://localhost:5000/api/team/${id}`, { withCredentials: true });
                toast.success("Member deleted successfully");
                fetchTeam();
            } catch (error) {
                toast.error("Delete failed");
            }
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
        setEditingId(null);
        setIsAdding(false);
        setProfileFile(null);
    };

    return (
        <div className="min-h-screen p-4 md:p-8 bg-[#050505] text-white">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Team Management</h1>
                        <p className="text-sm text-gray-400">Add, edit, or remove your exceptional team members.</p>
                    </div>
                    <button 
                        onClick={() => setIsAdding(!isAdding)}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all ${
                            isAdding 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
                        }`}
                    >
                        {isAdding ? <><X size={20} /> <span>Cancel</span></> : <><Plus size={20} /> <span>Add New Member</span></>}
                    </button>
                </div>

                <AnimatePresence>
                    {isAdding && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-12 p-8 rounded-3xl bg-[#0a0a0a]"
                        >
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Full Name</label>
                                        <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3">
                                            <User className="text-gray-400 mr-3" size={18} />
                                            <input name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="bg-transparent w-full outline-none text-sm" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Role / Position</label>
                                        <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3">
                                            <Briefcase className="text-gray-400 mr-3" size={18} />
                                            <input name="role" value={formData.role} onChange={handleInputChange} placeholder="Lead Developer" className="bg-transparent w-full outline-none text-sm" required />
                                        </div>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Profile Image</label>
                                        <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3">
                                            <Image className="text-gray-400 mr-3" size={18} />
                                            <input 
                                                type="file" 
                                                onChange={(e) => setProfileFile(e.target.files[0])} 
                                                className="bg-transparent w-full outline-none text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700" 
                                                accept="image/*"
                                            />
                                        </div>
                                        {formData.image && !profileFile && (
                                            <p className="text-[10px] text-gray-500 mt-1 italic">Current: {formData.image.split('/').pop()}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Biography</label>
                                        <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="4" placeholder="Tell us about this team member..." className="bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3 w-full outline-none text-sm" required />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Email</label>
                                        <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3">
                                            <Mail className="text-gray-400 mr-3" size={18} />
                                            <input name="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" className="bg-transparent w-full outline-none text-sm" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Location</label>
                                        <div className="flex items-center bg-black/5 dark:bg-black/40 rounded-xl px-4 py-3">
                                            <MapPin className="text-gray-400 mr-3" size={18} />
                                            <input name="location" value={formData.location} onChange={handleInputChange} placeholder="New York, USA" className="bg-transparent w-full outline-none text-sm" />
                                        </div>
                                    </div>

                                    {/* Social Links */}
                                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Twitter URL</label>
                                            <input name="socialLinks.twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} className="bg-black/5 dark:bg-black/40 rounded-xl px-4 py-2 w-full outline-none text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">LinkedIn URL</label>
                                            <input name="socialLinks.linkedin" value={formData.socialLinks.linkedin} onChange={handleInputChange} className="bg-black/5 dark:bg-black/40 rounded-xl px-4 py-2 w-full outline-none text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Instagram URL</label>
                                            <input name="socialLinks.instagram" value={formData.socialLinks.instagram} onChange={handleInputChange} className="bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 w-full outline-none text-xs" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Facebook URL</label>
                                            <input name="socialLinks.facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} className="bg-black/5 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 w-full outline-none text-xs" />
                                        </div>
                                    </div>

                                    {/* Skills Section */}
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Skills / Expertise</label>
                                        <div className="flex space-x-2">
                                            <input 
                                                value={newSkill} 
                                                onChange={(e) => setNewSkill(e.target.value)} 
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                placeholder="e.g. React, UI/UX" 
                                                className="bg-black/5 dark:bg-black/40 rounded-xl px-4 py-2 flex-1 outline-none text-sm" 
                                            />
                                            <button type="button" onClick={addSkill} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.skills.map((skill, index) => (
                                                <span key={index} className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-lg text-xs font-bold">
                                                    <span>{skill}</span>
                                                    <button type="button" onClick={() => removeSkill(index)} className="hover:text-red-500">
                                                        <X size={14} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Achievements Section */}
                                    <div className="md:col-span-2 space-y-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Achievements / Key Points</label>
                                        <div className="flex space-x-2">
                                            <input 
                                                value={newAchievement} 
                                                onChange={(e) => setNewAchievement(e.target.value)} 
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                                                placeholder="e.g. 5+ Years Experience" 
                                                className="bg-black/5 dark:bg-black/40 rounded-xl px-4 py-2 flex-1 outline-none text-sm" 
                                            />
                                            <button type="button" onClick={addAchievement} className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors">
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {formData.achievements && formData.achievements.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-xl text-sm border-l-4 border-orange-500 group">
                                                    <span>{item}</span>
                                                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button type="button" onClick={() => handleEditAchievement(index)} className="text-blue-400 hover:text-blue-300">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button type="button" onClick={() => removeAchievement(index)} className="text-gray-500 hover:text-red-500">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Projects Section */}
                                    <div className="md:col-span-2 space-y-4 pt-4">
                                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Portfolio Projects</label>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded-2xl">
                                            <input 
                                                value={newProject.title} 
                                                onChange={(e) => setNewProject({...newProject, title: e.target.value})} 
                                                placeholder="Project Title" 
                                                className="bg-black/20 rounded-xl px-4 py-2 outline-none text-sm" 
                                            />
                                            <input 
                                                value={newProject.link} 
                                                onChange={(e) => setNewProject({...newProject, link: e.target.value})} 
                                                placeholder="Project Link (URL)" 
                                                className="bg-black/20 rounded-xl px-4 py-2 outline-none text-sm" 
                                            />
                                            <input 
                                                type="file"
                                                onChange={(e) => setNewProject({...newProject, file: e.target.files[0]})} 
                                                className="bg-black/20 rounded-xl px-4 py-2 outline-none text-xs file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:bg-gray-700 file:text-white" 
                                                accept="image/*"
                                            />
                                            <div className="flex gap-2">
                                                <input 
                                                    value={newProject.description} 
                                                    onChange={(e) => setNewProject({...newProject, description: e.target.value})} 
                                                    placeholder="Short Description" 
                                                    className="bg-black/20 rounded-xl px-4 py-2 flex-1 outline-none text-sm" 
                                                />
                                                <button type="button" onClick={addProject} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                                                    <Plus size={20} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {formData.projects && formData.projects.map((project, index) => (
                                                <div key={index} className="flex gap-4 p-3 bg-white/5 rounded-2xl relative group">
                                                    <div className="w-16 h-16 rounded-xl bg-gray-800 flex items-center justify-center overflow-hidden">
                                                        {project.file ? (
                                                            <span className="text-[8px] text-blue-400">New Image</span>
                                                        ) : (
                                                            <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="text-sm font-bold">{project.title}</h5>
                                                        <p className="text-xs text-gray-400 line-clamp-2">{project.description}</p>
                                                    </div>
                                                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button type="button" onClick={() => handleEditProject(index)} className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all">
                                                            <Edit2 size={14} />
                                                        </button>
                                                        <button type="button" onClick={() => removeProject(index)} className="p-1.5 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <button type="button" onClick={resetForm} className="px-6 py-3 rounded-2xl font-bold transition-all bg-[#0d0d0d] hover:bg-gray-700">
                                        Cancel
                                    </button>
                                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-blue-600/20 flex items-center space-x-2">
                                        <Save size={20} />
                                        <span>{editingId ? "Update Member" : "Save Member"}</span>
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {team.map((member) => (
                        <motion.div
                            key={member._id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-4 rounded-3xl transition-all bg-[#0a0a0a]"
                        >
                            <div className="flex items-center space-x-4 mb-4">
                                <img src={member.image} alt={member.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500/30" />
                                <div>
                                    <h3 className="font-bold">{member.name}</h3>
                                    <p className="text-xs text-blue-500 font-bold">{member.role}</p>
                                </div>
                            </div>
                            <p className="text-xs mb-6 line-clamp-3 text-gray-400">{member.bio}</p>
                            <div className="flex justify-end space-x-2">
                                <button onClick={() => handleEdit(member)} className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                                    <Edit2 size={16} />
                                </button>
                                <button onClick={() => handleDelete(member._id)} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                {team.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-6 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                            <User size={40} className="text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">No team members yet</h3>
                        <p className="text-gray-500">Click the button above to add your first member.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTeam;
