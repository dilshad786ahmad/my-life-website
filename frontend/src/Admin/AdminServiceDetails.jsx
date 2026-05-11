import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, ArrowLeft, ArrowRight, Plus, Trash2, Layout, Monitor, Code, Box, Zap, Cpu, MousePointer2, Database, Image as ImageIcon, Eye } from "lucide-react";

const IconMap = { Layout, Monitor, Code, Box, Zap, Cpu, MousePointer2, Database };

const AdminServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainImage: "",
    breadcrumb: "",
    subTitle: "OUR TECHNOLOGY ECOSYSTEM",
    subHeading: "Integrated Product Design",
    features: [
      { title: "", description: "", icon: "Layout" }
    ],
    consultationLink: "/contact",
    portfolioLink: "/projects"
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/servicedetails/${serviceId}`);
        if (res.data.data) {
          setFormData(res.data.data);
          setImagePreview(res.data.data.mainImage || "");
        }
      } catch (error) {
        console.log("No existing details found, using defaults");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [serviceId]);

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, mainImage: url });
    setImagePreview(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.post(`http://localhost:5000/api/servicedetails/${serviceId}`, formData, { withCredentials: true });
      toast.success("Service Details Updated! 🚀");
    } catch (error) {
      toast.error("Failed to update details");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { title: "", description: "", icon: "Layout" }]
    });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin"></div>
        <p className="font-black text-orange-500 animate-pulse uppercase tracking-widest text-xs">Loading Editor...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white pb-20">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 bg-white/[0.02] p-8 rounded-[2rem] border border-white/10">
          <div className="flex flex-col gap-4">
            <button onClick={() => navigate("/admin/my/services")} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group w-fit">
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Return to Services Fleet</span>
            </button>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20">
                 <Layout className="text-orange-500 w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black italic tracking-tighter">Blueprint Editor</h1>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Instance ID: {serviceId}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
             <Link 
               to={`/service_details/${serviceId}`} 
               target="_blank"
               className="bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
             >
                Live Preview <ArrowRight size={14} />
             </Link>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Hero Content Section */}
          <section className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-orange-500/10 transition-colors"></div>
            
            <div className="flex items-center gap-4 mb-12">
               <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
               <h2 className="text-2xl font-black italic tracking-tight">Stage 1: Hero Visuals</h2>
            </div>
            
            <div className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Display Title</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40 text-lg font-bold" placeholder="e.g., Enterprise UI Engineering" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Navigation Trail</label>
                  <input type="text" value={formData.breadcrumb} onChange={e => setFormData({...formData, breadcrumb: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40 font-mono text-sm" placeholder="Home > Services > ..." />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Executive Summary</label>
                <textarea required rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40 leading-relaxed text-gray-300" placeholder="Briefly describe the impact of this service..."></textarea>
              </div>

              {/* Image URL + Preview */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Hero Image (Direct URL)</label>
                <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 focus-within:ring-2 focus-within:ring-orange-500/40 transition-all">
                  <ImageIcon className="w-5 h-5 text-gray-600 mr-4 shrink-0" />
                  <input
                    type="text"
                    value={formData.mainImage}
                    onChange={handleImageUrlChange}
                    className="w-full bg-transparent outline-none font-mono text-sm"
                    placeholder="Paste image URL (e.g. from Unsplash)..."
                  />
                </div>
                {/* Live Image Preview */}
                {imagePreview && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative mt-4 rounded-3xl overflow-hidden border border-white/10 aspect-video"
                  >
                    <img
                      src={imagePreview || null}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImagePreview("")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60 flex items-center gap-2">
                        <Eye size={10} /> Live Image Preview
                      </span>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Consultation Link</label>
                  <input type="text" value={formData.consultationLink} onChange={e => setFormData({...formData, consultationLink: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40" placeholder="/contact" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Portfolio / Case Study Link</label>
                  <input type="text" value={formData.portfolioLink} onChange={e => setFormData({...formData, portfolioLink: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40" placeholder="/projects" />
                </div>
              </div>
            </div>
          </section>

          {/* Ecosystem Section */}
          <section className="bg-[#0a0a0a] border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] -z-10 group-hover:bg-orange-500/10 transition-colors"></div>
            
            <div className="flex items-center gap-4 mb-12">
               <div className="w-1.5 h-8 bg-orange-500 rounded-full"></div>
               <h2 className="text-2xl font-black italic tracking-tight">Stage 2: Technical Ecosystem</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Ecosystem Sub-Label</label>
                <input type="text" value={formData.subTitle} onChange={e => setFormData({...formData, subTitle: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Main Section Heading</label>
                <input type="text" value={formData.subHeading} onChange={e => setFormData({...formData, subHeading: e.target.value})} className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-orange-500/40" />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600">Feature Definitions</h3>
                <button type="button" onClick={addFeature} className="flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 border border-orange-500/20 rounded-xl text-[10px] font-black uppercase text-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-lg shadow-orange-500/5">
                  <Plus size={14} /> New Definition
                </button>
              </div>

              <div className="grid gap-6">
                {formData.features.map((feature, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={idx} 
                    className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 relative group/card"
                  >
                    <button type="button" onClick={() => removeFeature(idx)} className="absolute top-6 right-6 text-gray-700 hover:text-red-500 transition-all scale-100 hover:scale-125">
                      <Trash2 size={18} />
                    </button>
                    <div className="grid lg:grid-cols-4 gap-8">
                      <div className="space-y-3">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Visual ID (Icon)</label>
                        <select value={feature.icon} onChange={e => handleFeatureChange(idx, 'icon', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 outline-none text-xs font-bold appearance-none cursor-pointer hover:border-orange-500/40">
                          {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                        </select>
                      </div>
                      <div className="lg:col-span-1 space-y-3">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Feature Title</label>
                        <input type="text" value={feature.title} onChange={e => handleFeatureChange(idx, 'title', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 outline-none text-xs font-bold focus:border-orange-500/40" />
                      </div>
                      <div className="lg:col-span-2 space-y-3">
                        <label className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">Brief Rationale</label>
                        <input type="text" value={feature.description} onChange={e => handleFeatureChange(idx, 'description', e.target.value)} className="w-full bg-black/60 border border-white/10 rounded-xl px-5 py-3 outline-none text-xs focus:border-orange-500/40" />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          <div className="flex justify-end pt-10 sticky bottom-8 z-50">
            <button type="submit" disabled={isUpdating} className="group relative bg-orange-500 hover:bg-orange-600 text-white px-16 py-6 rounded-full font-black text-xs uppercase tracking-[0.3em] flex items-center gap-4 transition-all shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)] hover:-translate-y-1 active:scale-95 disabled:bg-gray-800 disabled:shadow-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <Save size={22} className="group-hover:rotate-12 transition-transform" /> {isUpdating ? "Transmitting..." : "Synchronize Database"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminServiceDetails;
