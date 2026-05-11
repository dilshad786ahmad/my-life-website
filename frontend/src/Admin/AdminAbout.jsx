import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Edit, Save, Plus, Trash2, Layout, Image as ImageIcon, BarChart3, ChevronRight, X, Download } from "lucide-react";
import { GitHub as Github } from "../components/BrandIcons";

const AdminAbout = () => {
  const [activeTab, setActiveTab] = useState("hero"); // "hero", "stats", "images"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  // Forms
  const [heroForm, setHeroForm] = useState({
    badgeText: "", heading: "", subheading: "", description: "", 
    resumeLink: "", githubLink: "", experienceYears: ""
  });
  const [stats, setStats] = useState([]);
  const [images, setImages] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Modals
  const [statModal, setStatModal] = useState({ isOpen: false, isEdit: false, data: { num: "", label: "", color: "text-orange-500" }, index: null });
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "", mode: "url" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/aboutpage");
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeroForm(data.hero || {});
        setStats(data.stats || []);
        setImages(data.images || []);
      }
    } catch (error) {
      toast.error("Failed to fetch About page content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put("http://localhost:5000/api/aboutpage/hero", heroForm, { withCredentials: true });
      toast.success("Hero section updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveStat = async (e) => {
    e.preventDefault();
    let newStats = [...stats];
    if (statModal.isEdit) {
      newStats[statModal.index] = statModal.data;
    } else {
      newStats.push(statModal.data);
    }
    
    try {
      await axios.put("http://localhost:5000/api/aboutpage/stats", { stats: newStats }, { withCredentials: true });
      toast.success("Stats updated!");
      setStatModal({ ...statModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error("Failed to update stats");
    }
  };

  const handleDeleteStat = async (index) => {
    if (!window.confirm("Are you sure?")) return;
    const newStats = stats.filter((_, i) => i !== index);
    try {
      await axios.put("http://localhost:5000/api/aboutpage/stats", { stats: newStats }, { withCredentials: true });
      toast.success("Stat deleted!");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    const newImages = [...images, imageModal.url];
    try {
      await axios.put("http://localhost:5000/api/aboutpage/images", { images: newImages }, { withCredentials: true });
      toast.success("Image added!");
      setImageModal({ isOpen: false, url: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to add image");
    }
  };

  const handleDeleteImage = async (index) => {
    if (!window.confirm("Delete image?")) return;
    const newImages = images.filter((_, i) => i !== index);
    try {
      await axios.put("http://localhost:5000/api/aboutpage/images", { images: newImages }, { withCredentials: true });
      toast.success("Image removed!");
      fetchData();
    } catch (error) {
      toast.error("Failed to remove image");
    }
  };

  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setIsUploadingImage(true);
    try {
      const res = await axios.post("http://localhost:5000/api/aboutpage/upload-image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setImageModal({ ...imageModal, url: res.data.url });
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    setIsUploadingResume(true);
    try {
      const res = await axios.post("http://localhost:5000/api/aboutpage/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      setHeroForm({ ...heroForm, resumeLink: res.data.resumeLink });
      toast.success("Resume uploaded successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Resume upload failed");
    } finally {
      setIsUploadingResume(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-orange-500 font-black tracking-widest animate-pulse uppercase">Syncing Infrastructure...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">Profile Management</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            About Page Content
          </h1>
        </header>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab("hero")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "hero" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Layout className="w-4 h-4" /> Hero Section
          </button>
          <button 
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "stats" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Statistics
          </button>
          <button 
            onClick={() => setActiveTab("images")}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "images" ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Gallery
          </button>
        </div>

        {/* HERO CONTENT */}
        {activeTab === "hero" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Sparkles className="text-orange-500 w-5 h-5" />
                </div>
                Hero & Brand Identity
              </h2>
              <form onSubmit={handleUpdateHero} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Badge Text</label>
                    <input type="text" value={heroForm.badgeText} onChange={e => setHeroForm({...heroForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Heading</label>
                    <input type="text" value={heroForm.heading} onChange={e => setHeroForm({...heroForm, heading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Experience (e.g. 5+)</label>
                    <input type="text" value={heroForm.experienceYears} onChange={e => setHeroForm({...heroForm, experienceYears: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Sub-heading</label>
                    <input type="text" value={heroForm.subheading} onChange={e => setHeroForm({...heroForm, subheading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Main Description</label>
                    <textarea rows="4" value={heroForm.description} onChange={e => setHeroForm({...heroForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"></textarea>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1 flex items-center gap-2"><Download className="w-3 h-3"/> Resume (Link or Upload)</label>
                    <div className="flex gap-4">
                      <input type="text" value={heroForm.resumeLink} onChange={e => setHeroForm({...heroForm, resumeLink: e.target.value})} placeholder="Paste URL or upload file..." className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all text-sm" />
                      <label className="relative flex items-center justify-center px-6 py-4 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all min-w-[140px]">
                        <input type="file" onChange={handleResumeUpload} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 flex items-center gap-2">
                          {isUploadingResume ? "Uploading..." : "Upload File"}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase px-1 flex items-center gap-2"><Github className="w-3 h-3"/> GitHub Repo</label>
                    <input type="text" value={heroForm.githubLink} onChange={e => setHeroForm({...heroForm, githubLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all" />
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                    <Save size={18} /> {isUpdating ? "Processing..." : "Save Identity"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* STATS CONTENT */}
        {activeTab === "stats" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <BarChart3 className="text-orange-500 w-5 h-5" /> Performance Stats
                </h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Manage Key Metrics</p>
              </div>
              <button onClick={() => setStatModal({ isOpen: true, isEdit: false, data: { num: "", label: "", color: "text-orange-500" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                <Plus size={16} className="text-orange-500" /> Add Metric
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <div key={i} className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl transition-all duration-500 hover:bg-white/[0.04]">
                  <div className={`text-4xl font-black mb-2 tracking-tighter ${stat.color}`}>{stat.num}</div>
                  <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</div>
                  <div className="flex gap-2 mt-6 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => setStatModal({ isOpen: true, isEdit: true, data: stat, index: i })} className="p-2 bg-white/5 rounded-lg text-blue-400 hover:bg-blue-400/10"><Edit size={14}/></button>
                    <button onClick={() => handleDeleteStat(i)} className="p-2 bg-white/5 rounded-lg text-red-400 hover:bg-red-400/10"><Trash2 size={14}/></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* GALLERY CONTENT */}
        {activeTab === "images" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
             <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <ImageIcon className="text-orange-500 w-5 h-5" /> Visual Assets
                </h2>
                <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Hero Carousel Images</p>
              </div>
              <button onClick={() => setImageModal({ isOpen: true, url: "", mode: "url" })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                <Plus size={16} className="text-orange-500" /> New Image
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-video rounded-[2rem] overflow-hidden border border-white/10">
                  <img src={img} loading="lazy" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" alt="Gallery" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
                     <button onClick={() => handleDeleteImage(i)} className="p-4 bg-red-600 rounded-full shadow-xl shadow-red-600/20 hover:scale-110 transition-transform"><Trash2 size={20}/></button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(statModal.isOpen || imageModal.isOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setStatModal({ ...statModal, isOpen: false }); setImageModal({ ...imageModal, isOpen: false }); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
              
              {statModal.isOpen && (
                <form onSubmit={handleSaveStat} className="space-y-6">
                  <h3 className="text-2xl font-black">{statModal.isEdit ? "Update Metric" : "New Metric"}</h3>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Value (e.g. 50+)</label>
                    <input required type="text" value={statModal.data.num} onChange={e => setStatModal({...statModal, data: {...statModal.data, num: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Label</label>
                    <input required type="text" value={statModal.data.label} onChange={e => setStatModal({...statModal, data: {...statModal.data, label: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Color Class</label>
                    <select value={statModal.data.color} onChange={e => setStatModal({...statModal, data: {...statModal.data, color: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white">
                      <option value="text-orange-500" className="bg-[#0d0d0d]">Orange</option>
                      <option value="text-blue-400" className="bg-[#0d0d0d]">Blue</option>
                      <option value="text-white" className="bg-[#0d0d0d]">White</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Finalize Stat</button>
                </form>
              )}

              {imageModal.isOpen && (
                <form onSubmit={handleAddImage} className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black">Add Asset</h3>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                      <button type="button" onClick={() => setImageModal({...imageModal, mode: "url"})} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageModal.mode === "url" ? "bg-orange-500 text-white" : "text-gray-500"}`}>URL</button>
                      <button type="button" onClick={() => setImageModal({...imageModal, mode: "file"})} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${imageModal.mode === "file" ? "bg-orange-500 text-white" : "text-gray-500"}`}>File</button>
                    </div>
                  </div>

                  {imageModal.mode === "url" ? (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Image URL</label>
                      <input required type="text" value={imageModal.url} onChange={e => setImageModal({...imageModal, url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none placeholder:text-gray-700" placeholder="https://unsplash.com/..." />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Upload File</label>
                      <div className="relative group">
                        <input type="file" onChange={handleImageFileUpload} className="hidden" id="gallery-upload" accept="image/*" />
                        <label htmlFor="gallery-upload" className="flex flex-col items-center justify-center gap-4 w-full h-40 bg-white/5 border-2 border-dashed border-white/10 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-orange-500/50 transition-all overflow-hidden">
                          {imageModal.url ? (
                            <img src={imageModal.url} className="w-full h-full object-cover" alt="Preview" />
                          ) : (
                            <>
                              <ImageIcon className="w-8 h-8 text-gray-600 group-hover:text-orange-500 transition-colors" />
                              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                {isUploadingImage ? "Uploading..." : "Click to Browse"}
                              </span>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  )}
                  
                  <button type="submit" disabled={!imageModal.url || isUploadingImage} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                    {isUploadingImage ? "Processing..." : "Add to Gallery"}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAbout;