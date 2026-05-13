import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../apiConfig";
import { Code, Users, MessageCircle, Clock, Server, Database, Cloud, PenTool, Box, Cpu, Save, Plus, Trash2, Edit, Layout, Sparkles, Terminal } from "lucide-react";

const IconMap = { Code, Users, MessageCircle, Clock, Server, Database, Cloud, PenTool, Box, Cpu, Layout };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const AdminSkills = () => {
  const [activeTab, setActiveTab] = useState("header"); // "header", "tech", "soft", "misc"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  const [headerForm, setHeaderForm] = useState({ badgeText: "", title: "", description: "" });
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [miscForm, setMiscForm] = useState({ cta: { title: "", description: "", resumeLink: "", contactLink: "" }, codeBox: { code: "" } });
  
  const [isUpdating, setIsUpdating] = useState(false);

  // Modals
  const [skillModal, setSkillModal] = useState({ isOpen: false, type: "tech", isEdit: false, data: { name: "", desc: "", icon: "Code" }, index: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/skillspage`);
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeaderForm(data.header || {});
        setTechSkills(data.technicalSkills || []);
        setSoftSkills(data.softSkills || []);
        setMiscForm({ cta: data.cta || {}, codeBox: data.codeBox || { code: "" } });
      }
    } catch (error) {
      toast.error("Failed to fetch Skills content");
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
      await axios.put(`${API_BASE_URL}/api/skillspage/header`, headerForm, { withCredentials: true });
      toast.success("Header updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveSkill = async (e) => {
    e.preventDefault();
    let newSkills = skillModal.type === "tech" ? [...techSkills] : [...softSkills];
    if (skillModal.isEdit) newSkills[skillModal.index] = skillModal.data;
    else newSkills.push(skillModal.data);

    const endpoint = skillModal.type === "tech" ? "tech" : "soft";
    try {
      await axios.put(`${API_BASE_URL}/api/skillspage/${endpoint}`, { skills: newSkills }, { withCredentials: true });
      toast.success("Skills updated!");
      setSkillModal({ ...skillModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error("Failed to update skills");
    }
  };

  const handleDeleteSkill = async (type, index) => {
    if (!window.confirm("Delete skill?")) return;
    const currentSkills = type === "tech" ? techSkills : softSkills;
    const newSkills = currentSkills.filter((_, i) => i !== index);
    const endpoint = type === "tech" ? "tech" : "soft";
    try {
      await axios.put(`${API_BASE_URL}/api/skillspage/${endpoint}`, { skills: newSkills }, { withCredentials: true });
      toast.success("Skill deleted!");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleUpdateMisc = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put(`${API_BASE_URL}/api/skillspage/misc`, miscForm, { withCredentials: true });
      toast.success("CTA & Code updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black text-orange-500 animate-pulse uppercase tracking-widest">
      Architecting Skills...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Capability Engine</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Expertise Matrix
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("header")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "header" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Sparkles className="w-4 h-4" /> Header
          </button>
          <button onClick={() => setActiveTab("tech")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "tech" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Cpu className="w-4 h-4" /> Technical
          </button>
          <button onClick={() => setActiveTab("soft")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "soft" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Users className="w-4 h-4" /> Soft Skills
          </button>
          <button onClick={() => setActiveTab("misc")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "misc" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Terminal className="w-4 h-4" /> CTA & Code
          </button>
        </div>

        {activeTab === "header" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold mb-8">Section Header</h2>
            <form onSubmit={handleUpdateHeader} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Badge</label>
                    <input type="text" value={headerForm.badgeText} onChange={e => setHeaderForm({...headerForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Title</label>
                    <input type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Description</label>
                    <textarea rows="3" value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                  </div>
               </div>
               <div className="flex justify-end">
                  <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                    <Save size={18} /> {isUpdating ? "Syncing..." : "Update Header"}
                  </button>
               </div>
            </form>
          </motion.div>
        )}

        {activeTab === "tech" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                 <h2 className="text-xl font-bold flex items-center gap-3"><Code className="text-orange-500 w-5 h-5" /> Technical Skills</h2>
                 <button onClick={() => setSkillModal({ isOpen: true, type: "tech", isEdit: false, data: { name: "", desc: "", icon: "Code" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                    <Plus size={16} className="text-orange-500" /> New Skill
                 </button>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                 {techSkills.map((skill, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] relative overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all">
                       <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 text-orange-400 group-hover:scale-110 transition-transform">
                          <DynamicIcon name={skill.icon} className="w-6 h-6" />
                       </div>
                       <h3 className="font-bold text-white">{skill.name}</h3>
                       <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{skill.desc}</p>
                       <div className="flex gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setSkillModal({ isOpen: true, type: "tech", isEdit: true, data: skill, index: i })} className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-blue-400/10"><Edit size={14}/></button>
                          <button onClick={() => handleDeleteSkill("tech", i)} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 size={14}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}

        {activeTab === "soft" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                 <h2 className="text-xl font-bold flex items-center gap-3"><Users className="text-orange-500 w-5 h-5" /> Interpersonal Skills</h2>
                 <button onClick={() => setSkillModal({ isOpen: true, type: "soft", isEdit: false, data: { name: "", icon: "Users" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                    <Plus size={16} className="text-orange-500" /> New Skill
                 </button>
              </div>
              <div className="grid md:grid-cols-4 gap-6">
                 {softSkills.map((skill, i) => (
                    <div key={i} className="group bg-white/[0.02] border border-white/10 p-6 rounded-[2rem] flex items-center justify-between backdrop-blur-xl hover:bg-white/[0.04] transition-all">
                       <div className="flex items-center gap-4">
                          <div className="text-blue-400"><DynamicIcon name={skill.icon} className="w-5 h-5" /></div>
                          <h3 className="font-bold text-sm text-white">{skill.name}</h3>
                       </div>
                       <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => setSkillModal({ isOpen: true, type: "soft", isEdit: true, data: skill, index: i })} className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-blue-400/10"><Edit size={12}/></button>
                          <button onClick={() => handleDeleteSkill("soft", i)} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 size={12}/></button>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
        )}

        {activeTab === "misc" && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
              <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                 <h2 className="text-xl font-bold mb-8">CTA & Terminal Content</h2>
                 <form onSubmit={handleUpdateMisc} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-2">CTA Card</h3>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase px-1">CTA Heading</label>
                             <input type="text" value={miscForm.cta.title} onChange={e => setMiscForm({...miscForm, cta: {...miscForm.cta, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase px-1">CTA Description</label>
                             <textarea rows="3" value={miscForm.cta.description} onChange={e => setMiscForm({...miscForm, cta: {...miscForm.cta, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                          </div>
                       </div>
                       <div className="space-y-4">
                          <h3 className="text-xs font-black uppercase text-gray-500 tracking-widest border-b border-white/5 pb-2">Terminal Code</h3>
                          <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Code Snippet (JSON/JS)</label>
                             <textarea rows="8" value={miscForm.codeBox.code} onChange={e => setMiscForm({...miscForm, codeBox: { code: e.target.value}})} className="w-full bg-[#050505] border border-white/10 rounded-2xl px-6 py-4 outline-none font-mono text-xs text-green-400"></textarea>
                          </div>
                       </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-white/5">
                       <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20">
                         <Save size={18} /> {isUpdating ? "Processing..." : "Commit Changes"}
                       </button>
                    </div>
                 </form>
              </div>
           </motion.div>
        )}
      </div>

      <AnimatePresence>
        {skillModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSkillModal({ ...skillModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                <h3 className="text-2xl font-black mb-8">{skillModal.isEdit ? "Modify Expert" : "Register Expert"}</h3>
                <form onSubmit={handleSaveSkill} className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Symbol</label>
                      <select value={skillModal.data.icon} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none">
                         {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Skill Name</label>
                      <input required type="text" value={skillModal.data.name} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, name: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                   </div>
                   {skillModal.type === "tech" && (
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description / Category</label>
                        <input required type="text" value={skillModal.data.desc} onChange={e => setSkillModal({...skillModal, data: {...skillModal.data, desc: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                     </div>
                   )}
                   <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Finalize Expert</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminSkills;
