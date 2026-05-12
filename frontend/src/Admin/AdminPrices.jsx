import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit, Plus, Trash2, Save, X, Layout, Image as ImageIcon, 
  Briefcase, ChevronRight, Check, Sparkles, Asterisk, Layers, 
  Rocket, Code, AppWindow, Zap, Globe, Shield 
} from "lucide-react";

// Icon mapping for enterprise section
const IconMap = { Asterisk, Layers, Rocket, Code, Layout, AppWindow, Zap, Globe, Shield };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const AdminPrices = () => {
  const [activeTab, setActiveTab] = useState("header"); // header, basic, standard, enterprise
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Forms State
  const [headerForm, setHeaderForm] = useState({ title: "", subtitle: "", highlightText: "" });
  const [isUpdatingHeader, setIsUpdatingHeader] = useState(false);

  // Modals
  const [basicModal, setBasicModal] = useState({ isOpen: false, isEdit: false, data: { title: "", price: "", suffix: "/project", desc: "", features: "", highlight: false }, planId: null });
  const [standardModal, setStandardModal] = useState({ isOpen: false, isEdit: false, data: { title: "", price: "", desc: "", img: "", features: "" }, solutionId: null });
  const [enterpriseModal, setEnterpriseModal] = useState({ isOpen: false, isEdit: false, data: { title: "", price: "", desc: "", icon: "Layout", features: "", highlight: false }, systemId: null });

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://my-life-website.onrender.com/api/pricingpage", { withCredentials: true });
      const content = res.data.data;
      setPageContent(content);
      if(content && content.header) {
        setHeaderForm({
          title: content.header.title || "",
          subtitle: content.header.subtitle || "",
          highlightText: content.header.highlightText || ""
        });
      }
    } catch (error) {
      toast.error("Failed to load pricing content!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const parseFeatures = (features) => {
    if (typeof features === 'string') {
      return features.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    }
    return Array.isArray(features) ? features : [];
  };

  const handleUpdateHeader = async (e) => {
    e.preventDefault();
    setIsUpdatingHeader(true);
    try {
      await axios.put("https://my-life-website.onrender.com/api/pricingpage/header", headerForm, { withCredentials: true });
      toast.success("Header updated!");
      fetchContent();
    } catch (error) { toast.error("Update failed!"); }
    finally { setIsUpdatingHeader(false); }
  };

  const handleSaveBasic = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...basicModal.data, features: parseFeatures(basicModal.data.features) };
      if(basicModal.isEdit) {
        await axios.put(`https://my-life-website.onrender.com/api/pricingpage/basic/${basicModal.planId}`, payload, { withCredentials: true });
      } else {
        await axios.post("https://my-life-website.onrender.com/api/pricingpage/basic", payload, { withCredentials: true });
      }
      toast.success("Plan saved!");
      setBasicModal({ ...basicModal, isOpen: false });
      fetchContent();
    } catch (err) { toast.error("Operation failed!"); }
  };

  const handleDeleteBasic = async (id) => {
    if(!window.confirm("Delete this plan?")) return;
    try {
      await axios.delete(`https://my-life-website.onrender.com/api/pricingpage/basic/${id}`, { withCredentials: true });
      toast.success("Deleted!"); fetchContent();
    } catch(err) { toast.error("Delete failed!"); }
  };

  const handleSaveStandard = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...standardModal.data, features: parseFeatures(standardModal.data.features) };
      if(standardModal.isEdit) {
        await axios.put(`https://my-life-website.onrender.com/api/pricingpage/standard/${standardModal.solutionId}`, payload, { withCredentials: true });
      } else {
        await axios.post("https://my-life-website.onrender.com/api/pricingpage/standard", payload, { withCredentials: true });
      }
      toast.success("Solution saved!");
      setStandardModal({ ...standardModal, isOpen: false });
      fetchContent();
    } catch (err) { toast.error("Operation failed!"); }
  };

  const handleDeleteStandard = async (id) => {
    if(!window.confirm("Delete this solution?")) return;
    try {
      await axios.delete(`https://my-life-website.onrender.com/api/pricingpage/standard/${id}`, { withCredentials: true });
      toast.success("Deleted!"); fetchContent();
    } catch(err) { toast.error("Delete failed!"); }
  };

  const handleSaveEnterprise = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...enterpriseModal.data, features: parseFeatures(enterpriseModal.data.features) };
      if(enterpriseModal.isEdit) {
        await axios.put(`https://my-life-website.onrender.com/api/pricingpage/enterprise/${enterpriseModal.systemId}`, payload, { withCredentials: true });
      } else {
        await axios.post("https://my-life-website.onrender.com/api/pricingpage/enterprise", payload, { withCredentials: true });
      }
      toast.success("System saved!");
      setEnterpriseModal({ ...enterpriseModal, isOpen: false });
      fetchContent();
    } catch (err) { toast.error("Operation failed!"); }
  };

  const handleDeleteEnterprise = async (id) => {
    if(!window.confirm("Delete this system?")) return;
    try {
      await axios.delete(`https://my-life-website.onrender.com/api/pricingpage/enterprise/${id}`, { withCredentials: true });
      toast.success("Deleted!"); fetchContent();
    } catch(err) { toast.error("Delete failed!"); }
  };

  const tabs = [
    { id: "header", label: "Branding", icon: Sparkles },
    { id: "basic", label: "Basic Plans", icon: Check },
    { id: "standard", label: "Visual Solutions", icon: ImageIcon },
    { id: "enterprise", label: "Enterprise", icon: Briefcase }
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center font-black text-orange-500 animate-pulse uppercase tracking-widest">
      Mapping Revenue Flow...
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Financial Infrastructure</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Pricing Architect
          </h1>
        </header>

        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
           {activeTab === "header" && (
             <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Sparkles className="text-orange-500" /> Section Branding</h2>
                <form onSubmit={handleUpdateHeader} className="grid md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Page Title</label>
                      <input type="text" value={headerForm.title} onChange={e => setHeaderForm({...headerForm, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Highlight Badge</label>
                      <input type="text" value={headerForm.highlightText} onChange={e => setHeaderForm({...headerForm, highlightText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Narrative Subtitle</label>
                      <textarea rows="3" value={headerForm.subtitle} onChange={e => setHeaderForm({...headerForm, subtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                   </div>
                   <div className="md:col-span-2 flex justify-end">
                      <button type="submit" disabled={isUpdatingHeader} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all">
                        <Save size={18} /> {isUpdatingHeader ? "Processing..." : "Commit Branding"}
                      </button>
                   </div>
                </form>
             </div>
           )}

           {activeTab === "basic" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Check className="text-orange-500" /> Standard Tiers</h2>
                   <button onClick={() => setBasicModal({ isOpen: true, isEdit: false, data: { title: "", price: "", suffix: "/project", desc: "", features: "", highlight: false }, planId: null })} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"><Plus size={20}/></button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {pageContent?.basicPlans?.map(plan => (
                     <div key={plan._id} className={`bg-white/[0.02] border ${plan.highlight ? 'border-orange-500/50' : 'border-white/10'} rounded-[2.5rem] p-8 backdrop-blur-xl group hover:bg-white/[0.04] transition-all`}>
                        <h3 className="text-xl font-bold mb-4">{plan.title}</h3>
                        <p className="text-3xl font-black mb-6">{plan.price} <span className="text-xs text-gray-500 font-bold uppercase">{plan.suffix}</span></p>
                        <div className="flex gap-2 mt-auto pt-6 border-t border-white/5">
                           <button onClick={() => setBasicModal({ isOpen: true, isEdit: true, data: { ...plan, features: plan.features?.join(", ") || "" }, planId: plan._id })} className="flex-1 bg-blue-600/10 text-blue-500 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Edit</button>
                           <button onClick={() => handleDeleteBasic(plan._id)} className="bg-red-600/10 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "standard" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                   <h2 className="text-xl font-bold flex items-center gap-3"><ImageIcon className="text-orange-500" /> Visual Packages</h2>
                   <button onClick={() => setStandardModal({ isOpen: true, isEdit: false, data: { title: "", price: "", desc: "", img: "", features: "" }, solutionId: null })} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"><Plus size={20}/></button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {pageContent?.standardSolutions?.map(sol => (
                     <div key={sol._id} className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl group hover:bg-white/[0.04] transition-all">
                        <div className="h-40 relative">
                           <img src={sol.img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all" alt={sol.title} />
                        </div>
                        <div className="p-8">
                           <h3 className="font-bold mb-2">{sol.title}</h3>
                           <p className="text-orange-500 font-black mb-6">{sol.price}</p>
                           <div className="flex gap-2">
                              <button onClick={() => setStandardModal({ isOpen: true, isEdit: true, data: { ...sol, features: sol.features?.join(", ") || "" }, solutionId: sol._id })} className="flex-1 bg-blue-600/10 text-blue-500 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Edit</button>
                              <button onClick={() => handleDeleteStandard(sol._id)} className="bg-red-600/10 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {activeTab === "enterprise" && (
             <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
                   <h2 className="text-xl font-bold flex items-center gap-3"><Briefcase className="text-orange-500" /> Business Systems</h2>
                   <button onClick={() => setEnterpriseModal({ isOpen: true, isEdit: false, data: { title: "", price: "", desc: "", icon: "Layout", features: "", highlight: false }, systemId: null })} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all"><Plus size={20}/></button>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {pageContent?.enterpriseSystems?.map(sys => (
                     <div key={sys._id} className={`bg-white/[0.02] border ${sys.highlight ? 'border-orange-500' : 'border-white/10'} rounded-[2.5rem] p-8 backdrop-blur-xl group text-center`}>
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500">
                           <DynamicIcon name={sys.icon} className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold mb-2">{sys.title}</h3>
                        <p className="text-2xl font-black text-orange-500 mb-6">{sys.price}</p>
                        <div className="flex gap-2">
                           <button onClick={() => setEnterpriseModal({ isOpen: true, isEdit: true, data: { ...sys, features: sys.features?.join(", ") || "" }, systemId: sys._id })} className="flex-1 bg-blue-600/10 text-blue-500 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Edit</button>
                           <button onClick={() => handleDeleteEnterprise(sys._id)} className="bg-red-600/10 text-red-500 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}
        </motion.div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {(basicModal.isOpen || standardModal.isOpen || enterpriseModal.isOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setBasicModal({ ...basicModal, isOpen: false }); setStandardModal({ ...standardModal, isOpen: false }); setEnterpriseModal({ ...enterpriseModal, isOpen: false }); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-orange-500" />
              
              {basicModal.isOpen && (
                <>
                  <h3 className="text-2xl font-black mb-8">{basicModal.isEdit ? "Refine Plan" : "Launch Plan"}</h3>
                  <form onSubmit={handleSaveBasic} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Title</label>
                          <input required type="text" value={basicModal.data.title} onChange={e => setBasicModal({...basicModal, data: {...basicModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Price</label>
                          <input required type="text" value={basicModal.data.price} onChange={e => setBasicModal({...basicModal, data: {...basicModal.data, price: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Features (Split by comma or newline)</label>
                       <textarea rows="3" value={basicModal.data.features} onChange={e => setBasicModal({...basicModal, data: {...basicModal.data, features: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"></textarea>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                       <input type="checkbox" checked={basicModal.data.highlight} onChange={e => setBasicModal({...basicModal, data: {...basicModal.data, highlight: e.target.checked}})} className="w-5 h-5 rounded accent-orange-500" />
                       <label className="text-xs font-bold text-gray-400">Feature as Recommended</label>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all">Finalize Plan</button>
                  </form>
                </>
              )}

              {standardModal.isOpen && (
                <>
                  <h3 className="text-2xl font-black mb-8">Visual Solution</h3>
                  <form onSubmit={handleSaveStandard} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Title</label>
                          <input required type="text" value={standardModal.data.title} onChange={e => setStandardModal({...standardModal, data: {...standardModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Price</label>
                          <input required type="text" value={standardModal.data.price} onChange={e => setStandardModal({...standardModal, data: {...standardModal.data, price: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Cover Image URL</label>
                       <input required type="text" value={standardModal.data.img} onChange={e => setStandardModal({...standardModal, data: {...standardModal.data, img: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Features</label>
                       <textarea rows="3" value={standardModal.data.features} onChange={e => setStandardModal({...standardModal, data: {...standardModal.data, features: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"></textarea>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all">Sync Solution</button>
                  </form>
                </>
              )}

              {enterpriseModal.isOpen && (
                <>
                  <h3 className="text-2xl font-black mb-8">Enterprise Infrastructure</h3>
                  <form onSubmit={handleSaveEnterprise} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Title</label>
                          <input required type="text" value={enterpriseModal.data.title} onChange={e => setEnterpriseModal({...enterpriseModal, data: {...enterpriseModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Icon</label>
                          <select value={enterpriseModal.data.icon} onChange={e => setEnterpriseModal({...enterpriseModal, data: {...enterpriseModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50">
                            {Object.keys(IconMap).map(i => <option key={i} value={i} className="bg-[#0d0d0d]">{i}</option>)}
                          </select>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Starting Price</label>
                       <input required type="text" value={enterpriseModal.data.price} onChange={e => setEnterpriseModal({...enterpriseModal, data: {...enterpriseModal.data, price: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-bold text-gray-500 uppercase px-1">System Summary</label>
                       <textarea rows="3" value={enterpriseModal.data.desc} onChange={e => setEnterpriseModal({...enterpriseModal, data: {...enterpriseModal.data, desc: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"></textarea>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
                       <input type="checkbox" checked={enterpriseModal.data.highlight} onChange={e => setEnterpriseModal({...enterpriseModal, data: {...enterpriseModal.data, highlight: e.target.checked}})} className="w-5 h-5 rounded accent-orange-500" />
                       <label className="text-xs font-bold text-gray-400">Apply Premium Accent</label>
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-orange-500/20 transition-all">Commit System</button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPrices;
