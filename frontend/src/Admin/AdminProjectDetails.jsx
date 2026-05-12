import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, ArrowLeft, Image as ImageIcon, Plus, Trash2, Star, Sparkles, Layout, Box } from "lucide-react";

export default function AdminProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    projectId: projectId,
    caseStudyBadge: "Case Study",
    title: "",
    subtitle: "",
    description: "",
    category: "Big Project",
    price: 0,
    originalPrice: 0,
    mainImage: "",
    thumbnails: [],
    challengeTitle: "The Challenge",
    challengeDescription: "",
    outcomesTitle: "Key Outcomes",
    outcomesList: [],
    socialProofTitle: "Social Proof",
    overallRating: 4.8,
    reviews: [],
    projectBrief: { timeline: "", client: "", role: "" },
    techStack: []
  });

  const [outcomeInput, setOutcomeInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [reviewInput, setReviewInput] = useState({ rating: 5, text: "", user: "" });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`https://my-life-website.onrender.com/api/projectdetails/${projectId}`);
        if (res.data.data) {
            setFormData(res.data.data);
        }
      } catch (error) {
        console.log("No existing details found, starting fresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [projectId]);

  const handleImageUpload = async (e, field, isArray = false, index = null) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append("image", file);

    try {
      const res = await axios.post("https://my-life-website.onrender.com/api/projectdetails/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true
      });
      
      if (isArray) {
        const newArr = [...formData[field]];
        if (index !== null) newArr[index] = res.data.url;
        else newArr.push(res.data.url);
        setFormData({ ...formData, [field]: newArr });
      } else {
        setFormData({ ...formData, [field]: res.data.url });
      }
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post("https://my-life-website.onrender.com/api/projectdetails", formData, { withCredentials: true });
      toast.success("Project Details Synchronized!");
    } catch (error) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-orange-500 font-black animate-pulse">BOOTING CASE STUDY MODULE...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-12">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
                <ArrowLeft size={16} /> Back to Inventory
            </button>
            <h1 className="text-3xl font-black italic tracking-tighter">Case Study <span className="text-orange-500">Editor</span></h1>
        </header>

        <form onSubmit={handleSave} className="space-y-12 pb-20">
            {/* --- Hero Section --- */}
            <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Sparkles className="text-orange-500" /> Hero Content</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Badge Text</label>
                        <input type="text" value={formData.caseStudyBadge} onChange={e => setFormData({...formData, caseStudyBadge: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Main Title</label>
                        <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Subtitle / Tagline</label>
                        <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Overview / Description</label>
                        <textarea rows="4" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none leading-relaxed"></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Project Category</label>
                        <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white appearance-none cursor-pointer">
                            <option value="AI Integrated Project" className="bg-[#0d0d0d]">AI Integrated Project</option>
                            <option value="Mini Project" className="bg-[#0d0d0d]">Mini Project</option>
                            <option value="Medium Project" className="bg-[#0d0d0d]">Medium Project</option>
                            <option value="Big Project" className="bg-[#0d0d0d]">Big Project</option>
                        </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 text-orange-500">Offer Price ($)</label>
                        <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-orange-500/20 rounded-2xl px-6 py-4 outline-none text-orange-500 font-black text-xl" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1 text-gray-500">Regular Price (MRP) ($)</label>
                        <input type="number" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: parseInt(e.target.value) || 0})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-gray-500 line-through font-bold text-lg" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Hero Image</label>
                        <div className="relative group aspect-video rounded-3xl overflow-hidden border border-white/10 bg-white/5">
                            {formData.mainImage ? <img src={formData.mainImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-700 font-black">NO IMAGE UPLOADED</div>}
                            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                <input type="file" className="hidden" onChange={e => handleImageUpload(e, "mainImage")} />
                                <div className="bg-orange-500 px-6 py-3 rounded-xl font-bold flex items-center gap-2"><ImageIcon size={18} /> Upload New Hero</div>
                            </label>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- Thumbnails --- */}
            <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Layout className="text-blue-500" /> Visual Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.thumbnails.map((img, i) => (
                        <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border border-white/10">
                            <img src={img} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setFormData({...formData, thumbnails: formData.thumbnails.filter((_, idx) => idx !== i)})} className="absolute top-2 right-2 p-2 bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                        </div>
                    ))}
                    <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer">
                        <input type="file" className="hidden" onChange={e => handleImageUpload(e, "thumbnails", true)} />
                        <Plus size={24} />
                        <span className="text-[10px] font-black uppercase mt-2">Add Slide</span>
                    </label>
                </div>
            </section>

            {/* --- Project Details & Outcomes --- */}
            <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10">
                    <h3 className="text-lg font-bold mb-6 italic">The Challenge</h3>
                    <textarea rows="6" value={formData.challengeDescription} onChange={e => setFormData({...formData, challengeDescription: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-sm leading-relaxed" placeholder="Describe the project bottlenecks..."></textarea>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10">
                    <h3 className="text-lg font-bold mb-6 italic">Key Outcomes</h3>
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <input type="text" value={outcomeInput} onChange={e => setOutcomeInput(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" placeholder="Add specific achievement..." />
                            <button type="button" onClick={() => { if(!outcomeInput) return; setFormData({...formData, outcomesList: [...formData.outcomesList, outcomeInput]}); setOutcomeInput(""); }} className="bg-orange-500 px-4 rounded-xl font-bold"><Plus size={18}/></button>
                        </div>
                        <ul className="space-y-2">
                            {formData.outcomesList.map((item, i) => (
                                <li key={i} className="flex items-center justify-between bg-white/5 px-4 py-2 rounded-xl text-xs text-gray-400">
                                    {item} <Trash2 size={14} className="text-red-600 cursor-pointer" onClick={() => setFormData({...formData, outcomesList: formData.outcomesList.filter((_, idx) => idx !== i)})} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* --- Right Sidebar Info --- */}
            <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Box className="text-orange-500" /> Project Brief & Tech Stack</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Timeline</label>
                        <input type="text" value={formData.projectBrief.timeline} onChange={e => setFormData({...formData, projectBrief: {...formData.projectBrief, timeline: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Client</label>
                        <input type="text" value={formData.projectBrief.client} onChange={e => setFormData({...formData, projectBrief: {...formData.projectBrief, client: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Role</label>
                        <input type="text" value={formData.projectBrief.role} onChange={e => setFormData({...formData, projectBrief: {...formData.projectBrief, role: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest text-orange-500">Live Preview Link</label>
                        <input type="text" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className="w-full bg-white/5 border border-orange-500/20 rounded-xl px-4 py-3 outline-none" placeholder="https://..." />
                    </div>
                </div>
                <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Core Technologies</label>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {formData.techStack.map((tech, i) => (
                            <span key={i} className="bg-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-2">
                                {tech} <Trash2 size={12} className="text-red-500 cursor-pointer" onClick={() => setFormData({...formData, techStack: formData.techStack.filter((_, idx) => idx !== i)})} />
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 max-w-xs">
                        <input type="text" value={techInput} onChange={e => setTechInput(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm outline-none" placeholder="e.g. Next.js" />
                        <button type="button" onClick={() => { if(!techInput) return; setFormData({...formData, techStack: [...formData.techStack, techInput]}); setTechInput(""); }} className="bg-white/10 px-4 rounded-xl font-bold hover:bg-white/20 transition-all"><Plus size={18}/></button>
                    </div>
                </div>
            </section>

            {/* --- Social Proof & Reviews (Admin Mode: View & Delete Only) --- */}
            <section className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3"><Star className="text-orange-500" /> Client Feedback</h2>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8 px-2 border-l-2 border-orange-500">Reviews are submitted by clients. Admins can only remove inappropriate entries.</p>
                
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Aggregate Success Score</label>
                        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-orange-500 font-black text-xl">{formData.overallRating}</div>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        {formData.reviews.length > 0 ? (
                            formData.reviews.map((r, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 p-6 rounded-3xl border border-white/5 group hover:border-white/10 transition-all">
                                    <div>
                                        <p className="text-xs font-bold text-white mb-1">{r.user} <span className="text-orange-500 ml-2">★{r.rating}</span></p>
                                        <p className="text-[10px] text-gray-500 italic">"{r.text}"</p>
                                    </div>
                                    <button type="button" onClick={() => {
                                        const newReviews = formData.reviews.filter((_, idx) => idx !== i);
                                        const newRating = newReviews.length > 0 ? (newReviews.reduce((a, b) => a + b.rating, 0) / newReviews.length).toFixed(1) : 4.8;
                                        setFormData({...formData, reviews: newReviews, overallRating: parseFloat(newRating)});
                                    }} className="p-3 bg-red-600/10 text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:text-white">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl text-gray-700 font-black uppercase tracking-widest">No client reviews logged</div>
                        )}
                    </div>
                </div>
            </section>

            <div className="fixed bottom-10 right-10 z-[80]">
                <button type="submit" disabled={saving} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-orange-500/40 flex items-center gap-4 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50">
                    <Save size={20} /> {saving ? "SYNCHRONIZING..." : "COMMIT CHANGES"}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
