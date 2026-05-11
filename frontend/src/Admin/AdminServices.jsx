import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Code, Monitor, Edit, Save, Plus, Trash2, X, Layout, Sparkles, Box } from "lucide-react";

const IconMap = { Palette, Code, Monitor, Layout, Box };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const AdminServices = () => {
  const [activeTab, setActiveTab] = useState("header"); // "header", "cards"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  const [headerForm, setHeaderForm] = useState({ badgeText: "", heading: "", description: "" });
  const [services, setServices] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modals
  const [cardModal, setCardModal] = useState({ isOpen: false, isEdit: false, data: { title: "", description: "", icon: "Code", tags: [], iconColor: "text-orange-400" }, index: null });
  const [tagInput, setTagInput] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/servicespage");
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeaderForm(data.header || {});
        setServices(data.services || []);
      }
    } catch (error) {
      toast.error("Failed to fetch Services content");
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
      await axios.put("http://localhost:5000/api/servicespage/header", headerForm, { withCredentials: true });
      toast.success("Header updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    let newServices = [...services];
    if (cardModal.isEdit) newServices[cardModal.index] = cardModal.data;
    else newServices.push(cardModal.data);

    try {
      await axios.put("http://localhost:5000/api/servicespage/cards", { services: newServices }, { withCredentials: true });
      toast.success("Services updated!");
      setCardModal({ ...cardModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error("Failed to update services");
    }
  };

  const handleDeleteCard = async (index) => {
    if (!window.confirm("⚠️ ATTENTION: This will permanently delete this service card and all its associated page details. Proceed?")) return;
    const newServices = services.filter((_, i) => i !== index);
    try {
      await axios.put("http://localhost:5000/api/servicespage/cards", { services: newServices }, { withCredentials: true });
      toast.success("Service and associated data purged!");
      fetchData();
    } catch (error) {
      toast.error("Purge failed. Network error?");
    }
  };

  const addTag = () => {
    if (!tagInput.trim()) return;
    setCardModal({ ...cardModal, data: { ...cardModal.data, tags: [...cardModal.data.tags, tagInput.trim()] } });
    setTagInput("");
  };

  const removeTag = (tIndex) => {
    const newTags = cardModal.data.tags.filter((_, i) => i !== tIndex);
    setCardModal({ ...cardModal, data: { ...cardModal.data, tags: newTags } });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black text-orange-500 animate-pulse uppercase tracking-widest">
      Syncing Services...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Offering Infrastructure</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Services Configurator
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("header")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "header" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Sparkles className="w-4 h-4" /> Header Info
          </button>
          <button onClick={() => setActiveTab("cards")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "cards" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Layout className="w-4 h-4" /> Service Cards
          </button>
        </div>

        {activeTab === "header" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3">Section Headers</h2>
            <form onSubmit={handleUpdateHeader} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Badge Text</label>
                    <input type="text" value={headerForm.badgeText} onChange={e => setHeaderForm({...headerForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Heading</label>
                    <input type="text" value={headerForm.heading} onChange={e => setHeaderForm({...headerForm, heading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description</label>
                    <textarea rows="3" value={headerForm.description} onChange={e => setHeaderForm({...headerForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"></textarea>
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

        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
               <h2 className="text-xl font-bold flex items-center gap-3"><Palette className="text-orange-500 w-5 h-5" /> Active Services</h2>
               <button onClick={() => setCardModal({ isOpen: true, isEdit: false, data: { title: "", description: "", icon: "Code", tags: [], iconColor: "text-orange-400" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                  <Plus size={16} className="text-orange-500" /> New Service
               </button>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {services.map((service, i) => (
                 <div key={i} className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all flex flex-col">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                       <DynamicIcon name={service.icon} className={`w-8 h-8 ${service.iconColor}`} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">{service.description}</p>
                    <div className="flex gap-2 flex-wrap mb-8">
                       {service.tags?.map((tag, tI) => (
                         <span key={tI} className="text-[9px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full text-gray-400">{tag}</span>
                       ))}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => setCardModal({ isOpen: true, isEdit: true, data: service, index: i })} className="p-3 bg-white/5 rounded-xl text-blue-400 hover:bg-blue-400/10" title="Edit Card"><Edit size={16}/></button>
                       <Link to={`/admin/service-details/${service._id}`} className="p-3 bg-white/5 rounded-xl text-purple-400 hover:bg-purple-400/10" title="Manage Page Details"><Layout size={16}/></Link>
                       <button onClick={() => handleDeleteCard(i)} className="p-3 bg-white/5 rounded-xl text-red-400 hover:bg-red-400/10" title="Delete Service"><Trash2 size={16}/></button>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {cardModal.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCardModal({ ...cardModal, isOpen: false })} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                <h3 className="text-2xl font-black mb-8">{cardModal.isEdit ? "Refine Service" : "Deploy New Service"}</h3>
                <form onSubmit={handleSaveCard} className="space-y-6">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Icon Symbol</label>
                        <select value={cardModal.data.icon} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none">
                           {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Icon Theme</label>
                        <select value={cardModal.data.iconColor} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, iconColor: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none">
                           <option value="text-orange-400" className="bg-[#0d0d0d]">Orange</option>
                           <option value="text-blue-400" className="bg-[#0d0d0d]">Blue</option>
                           <option value="text-white" className="bg-[#0d0d0d]">White</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Service Title</label>
                      <input required type="text" value={cardModal.data.title} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description</label>
                      <textarea required rows="3" value={cardModal.data.description} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Core Tech (Tags)</label>
                      <div className="flex gap-2 mb-2 flex-wrap">
                         {cardModal.data.tags.map((tag, ti) => (
                           <span key={ti} className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-orange-500/20">
                             {tag} <X size={10} className="cursor-pointer" onClick={() => removeTag(ti)} />
                           </span>
                         ))}
                      </div>
                      <div className="flex gap-2">
                         <input type="text" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 outline-none text-xs" placeholder="Add tag..." />
                         <button type="button" onClick={addTag} className="bg-white/10 px-4 rounded-xl hover:bg-white/20 transition-all text-xs font-bold">Add</button>
                      </div>
                   </div>
                   <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Finalize Service</button>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminServices;