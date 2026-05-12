import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FolderGit2, Edit, Save, Plus, Trash2, X, Layout, Sparkles, Image as ImageIcon, ExternalLink, Box } from "lucide-react";

const AdminProjects = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("header"); // "header", "items"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  const [headerForm, setHeaderForm] = useState({ badgeText: "", title: "", description: "" });
  const [projects, setProjects] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modals
  const [projectModal, setProjectModal] = useState({ isOpen: false, isEdit: false, data: { title: "", category: "", image: "", link: "#", description: "", tags: [], price: 0, originalPrice: 0 }, index: null });
  const [tagInput, setTagInput] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://my-life-website.onrender.com/api/projectspage");
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeaderForm(data.header || {});
        setProjects(data.projects || []);
      }
    } catch (error) {
      toast.error("Failed to fetch Projects content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateHeader = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put("https://my-life-website.onrender.com/api/projectspage/header", headerForm, { withCredentials: true });
      toast.success("Header updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    let newProjects = [...projects];
    if (projectModal.isEdit) newProjects[projectModal.index] = projectModal.data;
    else newProjects.push(projectModal.data);

    try {
      await axios.put("https://my-life-website.onrender.com/api/projectspage/items", { projects: newProjects }, { withCredentials: true });
      toast.success("Portfolio synchronized!");
      setProjectModal({ ...projectModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error("Failed to update projects");
    }
  };

  const handleDeleteProject = async (index) => {
    if (!window.confirm("Delete project?")) return;
    const newProjects = projects.filter((_, i) => i !== index);
    try {
      await axios.put("https://my-life-website.onrender.com/api/projectspage/items", { projects: newProjects }, { withCredentials: true });
      toast.success("Project removed!");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setProjectModal({ ...projectModal, data: { ...projectModal.data, tags: [...projectModal.data.tags, tagInput.trim()] } });
    setTagInput("");
  };

  const removeTag = (tI) => {
    const newTags = projectModal.data.tags.filter((_, i) => i !== tI);
    setProjectModal({ ...projectModal, data: { ...projectModal.data, tags: newTags } });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black text-orange-500 animate-pulse uppercase tracking-widest">
      Scanning Repositories...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Gallery Infrastructure</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Portfolio Manager
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("header")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "header" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Sparkles className="w-4 h-4" /> Section Info
          </button>
          <button onClick={() => setActiveTab("items")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "items" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <FolderGit2 className="w-4 h-4" /> Project Inventory
          </button>
        </div>

        {activeTab === "header" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h2 className="text-xl font-bold mb-8">Page Branding</h2>
              <form onSubmit={handleUpdateHeader} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Section Badge</label>
                       <input type="text" value={headerForm.badgeText} onChange={e => setHeaderForm({...headerForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Display Title</label>
                       <input type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Narrative Description</label>
                       <textarea rows="3" value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                    </div>
                 </div>
                 <div className="flex justify-end pt-6 border-t border-white/5">
                    <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                      <Save size={18} /> {isUpdating ? "Processing..." : "Commit Branding"}
                    </button>
                 </div>
              </form>
           </motion.div>
        )}

        {activeTab === "items" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                 <h2 className="text-xl font-bold flex items-center gap-3"><FolderGit2 className="text-orange-500 w-5 h-5" /> Case Studies</h2>
                 <button onClick={() => setProjectModal({ isOpen: true, isEdit: false, data: { title: "", category: "", image: "", link: "#", description: "", tags: [], price: 0, originalPrice: 0 }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                    <Plus size={16} className="text-orange-500" /> New Project
                 </button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {projects.map((project, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all flex flex-col">
                       <div className="relative aspect-video overflow-hidden">
                          <img src={project.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt={project.title} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                             <button onClick={() => setProjectModal({ isOpen: true, isEdit: true, data: project, index: i })} className="p-4 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-110 transition-transform"><Edit size={20}/></button>
                             <button onClick={() => navigate(`/admin/project-details/${project._id}`)} className="p-4 bg-orange-600 rounded-2xl shadow-xl shadow-orange-600/20 hover:scale-110 transition-transform"><ExternalLink size={20}/></button>
                             <button onClick={() => handleDeleteProject(i)} className="p-4 bg-red-600 rounded-2xl shadow-xl shadow-red-600/20 hover:scale-110 transition-transform"><Trash2 size={20}/></button>
                          </div>
                       </div>
                       <div className="p-8">
                          <div className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-2">{project.category}</div>
                          <h3 className="text-xl font-bold mb-4">{project.title}</h3>
                          <p className="text-gray-500 text-[10px] leading-relaxed mb-6 line-clamp-2 uppercase tracking-wider">
                             {project.description}
                          </p>
                          <div className="flex gap-2 flex-wrap mb-6">
                             {project.tags?.map((tag, tI) => (
                               <span key={tI} className="text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-gray-500 border border-white/5">{tag}</span>
                             ))}
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}
      </div>

      <AnimatePresence>
         {projectModal.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProjectModal({ ...projectModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                  <h3 className="text-2xl font-black mb-8">{projectModal.isEdit ? "Refine Work" : "Register Work"}</h3>
                  <form onSubmit={handleSaveProject} className="space-y-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Project Title</label>
                           <input required type="text" value={projectModal.data.title} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Category</label>
                           <input required type="text" value={projectModal.data.category} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, category: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Offer Price ($)</label>
                           <input type="number" value={projectModal.data.price} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, price: parseInt(e.target.value) || 0}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-orange-500 font-bold" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Regular Price (Crossed) ($)</label>
                           <input type="number" value={projectModal.data.originalPrice} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, originalPrice: parseInt(e.target.value) || 0}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-gray-500 line-through font-bold" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Thumbnail Image</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                {projectModal.data.image ? <img src={projectModal.data.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon size={16} className="text-gray-700" /></div>}
                            </div>
                            <label className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold">
                                <input type="file" className="hidden" onChange={async (e) => {
                                    const file = e.target.files[0];
                                    if(!file) return;
                                    const data = new FormData();
                                    data.append("image", file);
                                    try {
                                        const res = await axios.post("https://my-life-website.onrender.com/api/projectdetails/upload", data, {
                                            headers: { "Content-Type": "multipart/form-data" },
                                            withCredentials: true
                                        });
                                        setProjectModal({...projectModal, data: {...projectModal.data, image: res.data.url}});
                                        toast.success("Thumbnail ready!");
                                    } catch (err) {
                                        toast.error("Upload failed");
                                    }
                                }} />
                                <Plus size={16} /> {projectModal.data.image ? "Change Image" : "Upload Thumbnail"}
                            </label>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Project Description (Short)</label>
                        <textarea rows="3" value={projectModal.data.description} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-sm" placeholder="Brief overview for the card..."></textarea>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">External Link</label>
                        <input type="text" value={projectModal.data.link} onChange={e => setProjectModal({...projectModal, data: {...projectModal.data, link: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" placeholder="#" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Tech Stack (Tags)</label>
                        <div className="flex gap-2 mb-2 flex-wrap">
                           {projectModal.data.tags.map((tag, ti) => (
                             <span key={ti} className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-orange-500/20">
                               {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag(ti)} />
                             </span>
                           ))}
                        </div>
                        <div className="flex gap-2">
                           <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-xs" placeholder="Add tech..." />
                           <button type="button" onClick={addTag} className="bg-white/10 px-4 rounded-xl hover:bg-white/20 transition-all text-xs font-bold">Add</button>
                        </div>
                     </div>
                     <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Publish Work</button>
                  </form>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProjects;
