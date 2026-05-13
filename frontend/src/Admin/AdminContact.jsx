import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { API_BASE_URL } from "../apiConfig";
import { Mail, Trash2, Filter, Clock, X, AlertTriangle, Edit, Plus, Layout, Smartphone, Brush, Gauge, MapPin, Save, ChevronRight, MessageSquare, ShieldCheck } from "lucide-react";

// Icon mapping for dynamic rendering
const IconMap = {
  Mail, MapPin, Layout, Smartphone, Brush, Gauge
};

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout; // Default to Layout if not found
  return <IconComponent className={className} />;
};

const AdminContact = () => {
  const [activeTab, setActiveTab] = useState("leads"); // "leads" or "content"
  
  // --- LEADS STATE ---
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState(""); 
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [deleteModalData, setDeleteModalData] = useState(null);

  // --- CONTENT STATE ---
  const [pageContent, setPageContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [mainContentForm, setMainContentForm] = useState({ specializedHeading: "", specializedDesc: "", contactHeading: "", contactDesc: "" });
  const [isUpdatingMain, setIsUpdatingMain] = useState(false);

  // Modals for Cards & Info
  const [cardModal, setCardModal] = useState({ isOpen: false, isEdit: false, data: { iconName: "Layout", title: "" }, cardId: null });
  const [infoModal, setInfoModal] = useState({ isOpen: false, isEdit: false, data: { iconName: "Mail", label: "", value: "" }, infoId: null });

  // 1. Fetch Leads
  const fetchLeads = async () => {
    setLoadingLeads(true);
    try {
      const url = filter 
        ? `${API_BASE_URL}/api/contact?status=${filter}` 
        : `${API_BASE_URL}/api/contact`;
      
      const res = await axios.get(url, { withCredentials: true });
      setLeads(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      toast.error("Leads load nahi ho payi!");
    } finally {
      setLoadingLeads(false);
    }
  };

  // 2. Fetch Page Content
  const fetchContent = async () => {
    setLoadingContent(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contactpage`);
      const content = res.data.data;
      setPageContent(content);
      if(content) {
        setMainContentForm({
          specializedHeading: content.specializedSection?.heading || "",
          specializedDesc: content.specializedSection?.description || "",
          contactHeading: content.contactSection?.heading || "",
          contactDesc: content.contactSection?.paragraph || ""
        });
      }
    } catch (error) {
      toast.error("Content load nahi ho paya!");
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    if(activeTab === "leads") fetchLeads();
    if(activeTab === "content") fetchContent();
  }, [filter, activeTab]);

  // --- LEADS HANDLERS ---
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(`${API_BASE_URL}/api/contact/${id}`, 
        { status: newStatus }, 
        { withCredentials: true }
      );
      toast.success(`Status updated to ${newStatus}`);
      fetchLeads(); 
    } catch (error) {
      toast.error("Update fail ho gaya!");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalData) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/contact/${deleteModalData}`, { withCredentials: true });
      toast.success("Lead deleted successfully! 🗑️");
      setDeleteModalData(null); 
      fetchLeads(); 
    } catch (error) {
      toast.error("Delete nahi ho paya!");
    }
  };

  // --- CONTENT HANDLERS ---
  const handleUpdateMainContent = async (e) => {
    e.preventDefault();
    setIsUpdatingMain(true);
    try {
      await axios.put(`${API_BASE_URL}/api/contactpage/main-text`, mainContentForm, { withCredentials: true });
      toast.success("Main content updated!");
      fetchContent();
    } catch (error) {
      toast.error("Failed to update content!");
    } finally {
      setIsUpdatingMain(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    try {
      if(cardModal.isEdit) {
        await axios.put(`${API_BASE_URL}/api/contactpage/cards/${cardModal.cardId}`, cardModal.data, { withCredentials: true });
        toast.success("Card updated!");
      } else {
        await axios.post(`${API_BASE_URL}/api/contactpage/cards`, cardModal.data, { withCredentials: true });
        toast.success("Card added!");
      }
      setCardModal({ ...cardModal, isOpen: false });
      fetchContent();
    } catch (error) {
      toast.error("Operation failed!");
    }
  };

  const handleDeleteCard = async (id) => {
    if(!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/contactpage/cards/${id}`, { withCredentials: true });
      toast.success("Card deleted!");
      fetchContent();
    } catch(err) { toast.error("Failed to delete card!"); }
  };

  const handleSaveInfo = async (e) => {
    e.preventDefault();
    try {
      if(infoModal.isEdit) {
        await axios.put(`${API_BASE_URL}/api/contactpage/info/${infoModal.infoId}`, infoModal.data, { withCredentials: true });
        toast.success("Info updated!");
      } else {
        await axios.post(`${API_BASE_URL}/api/contactpage/info`, infoModal.data, { withCredentials: true });
        toast.success("Info added!");
      }
      setInfoModal({ ...infoModal, isOpen: false });
      fetchContent();
    } catch (error) {
      toast.error("Operation failed!");
    }
  };

  const handleDeleteInfo = async (id) => {
    if(!window.confirm("Are you sure you want to delete this info item?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/contactpage/info/${id}`, { withCredentials: true });
      toast.success("Info deleted!");
      fetchContent();
    } catch(err) { toast.error("Failed to delete info!"); }
  };

  // Status Badge Colors
  const getStatusStyle = (status) => {
    switch (status) {
      case "new": return "bg-red-500/10 text-red-500 border-red-500/20";
      case "read": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "replied": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Communication HUB</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Inquiry Management
          </h1>
        </header>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "leads" 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Contact Leads
          </button>
          <button 
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "content" 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layout className="w-4 h-4" />
            Manage Content
          </button>
        </div>

        {/* --- LEADS TAB CONTENT --- */}
        {activeTab === "leads" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <Mail className="text-orange-500 w-5 h-5" /> 
                  Active Inquiries
                </h2>
                <p className="text-gray-500 text-xs font-medium tracking-wide mt-1 uppercase">Tracking {leads.length} user submissions</p>
              </div>
              <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                <Filter size={16} className="text-gray-500" />
                <select 
                  className="bg-transparent text-sm font-bold text-gray-300 outline-none cursor-pointer"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="" className="bg-[#0d0d0d]">Status: All</option>
                  <option value="new" className="bg-[#0d0d0d]">New</option>
                  <option value="read" className="bg-[#0d0d0d]">Read</option>
                  <option value="replied" className="bg-[#0d0d0d]">Replied</option>
                </select>
              </div>
            </div>

            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-white/[0.02] border-b border-white/5">
                      <th className="px-8 py-5 font-bold text-[10px] text-gray-500 uppercase tracking-widest">Sender</th>
                      <th className="px-8 py-5 font-bold text-[10px] text-gray-500 uppercase tracking-widest">Message Content</th>
                      <th className="px-8 py-5 font-bold text-[10px] text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 font-bold text-[10px] text-gray-500 uppercase tracking-widest text-right">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingLeads ? (
                      <tr><td colSpan="4" className="text-center py-24 animate-pulse text-gray-600 font-bold uppercase tracking-tighter">Syncing Leads...</td></tr>
                    ) : leads.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-24 text-gray-600 italic">No inquiries found in this category.</td></tr>
                    ) : (
                      leads.map((lead) => (
                        <tr key={lead._id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-sm">
                                 {lead.firstName?.charAt(0)}
                               </div>
                               <div>
                                 <div className="font-bold text-white">{lead.firstName} {lead.lastName}</div>
                                 <div className="text-xs text-gray-500">{lead.email}</div>
                               </div>
                            </div>
                            <div className="text-[10px] text-gray-600 mt-2 flex items-center gap-1.5">
                              <Clock size={12} /> {new Date(lead.createdAt).toLocaleString()}
                            </div>
                          </td>
                          <td className="px-8 py-6 max-w-sm overflow-hidden">
                            <div className="font-bold text-orange-400 text-xs mb-1 truncate">{lead.subject}</div>
                            <div className="text-sm text-gray-400 line-clamp-1 group-hover:line-clamp-none transition-all">{lead.message}</div>
                          </td>
                          <td className="px-8 py-6">
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusUpdate(lead._id, e.target.value)}
                              className={`text-[10px] font-black px-4 py-1.5 rounded-full border cursor-pointer outline-none transition-all shadow-lg ${getStatusStyle(lead.status)}`}
                            >
                              <option value="new" className="bg-[#0d0d0d]">NEW</option>
                              <option value="read" className="bg-[#0d0d0d]">READ</option>
                              <option value="replied" className="bg-[#0d0d0d]">REPLIED</option>
                            </select>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => setDeleteModalData(lead._id)}
                              className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-500/5 text-red-500 border border-red-500/10 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- CONTENT TAB --- */}
        {activeTab === "content" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {loadingContent ? (
               <div className="text-center py-24 text-gray-600 font-bold uppercase tracking-tighter animate-pulse bg-white/[0.02] border border-white/10 rounded-[2.5rem]">
                 Fetching Page Metadata...
               </div>
            ) : (
              <>
                {/* 1. MAIN CONTENT FORM */}
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                  <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                      <Edit className="text-orange-500 w-5 h-5" />
                    </div>
                    Global Text Settings
                  </h2>
                  <form onSubmit={handleUpdateMainContent} className="space-y-10">
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                          <ShieldCheck className="w-4 h-4 text-orange-500" />
                          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Solutions Section</h3>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Primary Heading</label>
                          <input type="text" value={mainContentForm.specializedHeading} onChange={e => setMainContentForm({...mainContentForm, specializedHeading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Detailed Description</label>
                          <textarea rows="3" value={mainContentForm.specializedDesc} onChange={e => setMainContentForm({...mainContentForm, specializedDesc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"></textarea>
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                          <Mail className="w-4 h-4 text-orange-500" />
                          <h3 className="text-xs font-black tracking-widest text-gray-400 uppercase">Contact Info Block</h3>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Section Heading</label>
                          <input type="text" value={mainContentForm.contactHeading} onChange={e => setMainContentForm({...mainContentForm, contactHeading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Paragraph Content</label>
                          <textarea rows="3" value={mainContentForm.contactDesc} onChange={e => setMainContentForm({...mainContentForm, contactDesc: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                       <button type="submit" disabled={isUpdatingMain} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                         <Save size={18} /> {isUpdatingMain ? "Syncing..." : "Deploy All Updates"}
                       </button>
                    </div>
                  </form>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* 2. SOLUTION CARDS */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold flex items-center gap-3">
                        <Layout className="text-orange-500 w-5 h-5" /> 
                        Skill Cards
                      </h2>
                      <button onClick={() => setCardModal({ isOpen: true, isEdit: false, data: { iconName: "Layout", title: "" }, cardId: null })} className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl text-orange-500 transition-all"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      {pageContent?.specializedSection?.cards?.map(card => (
                        <div key={card._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all duration-300">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><DynamicIcon name={card.iconName} className="w-6 h-6"/></div>
                             <span className="font-bold text-gray-200">{card.title}</span>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setCardModal({ isOpen: true, isEdit: true, data: { iconName: card.iconName, title: card.title }, cardId: card._id })} className="w-9 h-9 flex items-center justify-center bg-white/5 text-blue-400 rounded-lg hover:bg-blue-400/10"><Edit size={16}/></button>
                             <button onClick={() => handleDeleteCard(card._id)} className="w-9 h-9 flex items-center justify-center bg-white/5 text-red-400 rounded-lg hover:bg-red-400/10"><Trash2 size={16}/></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. CONTACT INFO ITEMS */}
                  <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-xl font-bold flex items-center gap-3">
                        <MapPin className="text-orange-500 w-5 h-5" /> 
                        Info Elements
                      </h2>
                      <button onClick={() => setInfoModal({ isOpen: true, isEdit: false, data: { iconName: "Mail", label: "", value: "" }, infoId: null })} className="bg-white/5 hover:bg-white/10 border border-white/10 p-3 rounded-xl text-orange-500 transition-all"><Plus size={20}/></button>
                    </div>
                    <div className="space-y-4">
                      {pageContent?.contactSection?.infoItems?.map(info => (
                        <div key={info._id} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.04] transition-all duration-300">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500"><DynamicIcon name={info.iconName} className="w-6 h-6"/></div>
                             <div>
                               <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{info.label}</p>
                               <p className="font-bold text-gray-200 text-sm">{info.value}</p>
                             </div>
                           </div>
                           <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setInfoModal({ isOpen: true, isEdit: true, data: { iconName: info.iconName, label: info.label, value: info.value }, infoId: info._id })} className="w-9 h-9 flex items-center justify-center bg-white/5 text-blue-400 rounded-lg hover:bg-blue-400/10"><Edit size={16}/></button>
                             <button onClick={() => handleDeleteInfo(info._id)} className="w-9 h-9 flex items-center justify-center bg-white/5 text-red-400 rounded-lg hover:bg-red-400/10"><Trash2 size={16}/></button>
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {(deleteModalData || cardModal.isOpen || infoModal.isOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setDeleteModalData(null); setCardModal({ ...cardModal, isOpen: false }); setInfoModal({ ...infoModal, isOpen: false }); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              
              {deleteModalData && (
                <>
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-black">Confirm Deletion</h3>
                    <p className="text-gray-500 text-sm">This entry will be permanently removed from the infrastructure. Do you wish to proceed?</p>
                    <div className="flex gap-4 pt-6">
                      <button onClick={() => setDeleteModalData(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10">Cancel</button>
                      <button onClick={handleConfirmDelete} className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-xl shadow-red-600/20">Delete Lead</button>
                    </div>
                  </div>
                </>
              )}

              {cardModal.isOpen && (
                <>
                  <h3 className="text-2xl font-black mb-8">{cardModal.isEdit ? "Modify Element" : "New Component"}</h3>
                  <form onSubmit={handleSaveCard} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Symbol</label>
                      <select value={cardModal.data.iconName} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, iconName: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white">
                        {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Display Label</label>
                      <input required type="text" value={cardModal.data.title} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all">Finalize Changes</button>
                  </form>
                </>
              )}

              {infoModal.isOpen && (
                <>
                  <h3 className="text-2xl font-black mb-8">{infoModal.isEdit ? "Update Data" : "New Entry"}</h3>
                  <form onSubmit={handleSaveInfo} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Icon Symbol</label>
                      <select value={infoModal.data.iconName} onChange={e => setInfoModal({...infoModal, data: {...infoModal.data, iconName: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none">
                        {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Field Label</label>
                      <input required type="text" value={infoModal.data.label} onChange={e => setInfoModal({...infoModal, data: {...infoModal.data, label: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Data Value</label>
                      <input required type="text" value={infoModal.data.value} onChange={e => setInfoModal({...infoModal, data: {...infoModal.data, value: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all">Finalize Entry</button>
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

export default AdminContact;
