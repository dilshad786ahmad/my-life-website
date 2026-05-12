import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Edit, Save, Plus, Trash2, Image as ImageIcon, Box, Cloud, Lock, BarChart3, X, Sparkles } from "lucide-react";
import { SkeletonBase } from "../components/Skeleton";

const IconMap = { Cloud, Lock, BarChart3, Box, Layout };

const DynamicIcon = ({ name, className }) => {
  const IconComponent = IconMap[name] || Layout;
  return <IconComponent className={className} />;
};

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState("hero"); // "hero", "cards", "social"
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState(null);
  
  const [heroForm, setHeroForm] = useState({ badgeText: "", heading: "", subheading: "", images: [], mainImage: "", cardImages: [] });
  const [socialLinks, setSocialLinks] = useState({ youtube: "", instagram: "", linkedin: "", x: "", facebook: "", whatsapp: "" });
  const [cards, setCards] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  // Modals
  const [cardModal, setCardModal] = useState({ isOpen: false, isEdit: false, data: { title: "", description: "", icon: "Cloud" }, index: null });
  const [imageModal, setImageModal] = useState({ isOpen: false, url: "", target: "carousel" }); // "carousel", "main", "cardStack"

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://my-life-website.onrender.com/api/homepage");
      const data = res.data.data;
      setContent(data);
      if (data) {
        setHeroForm({
          badgeText: data.hero?.badgeText || "",
          heading: data.hero?.heading || "",
          subheading: data.hero?.subheading || "",
          images: data.hero?.images || [],
          mainImage: data.hero?.mainImage || "",
          cardImages: data.hero?.cardImages || []
        });
        setSocialLinks(data.socialLinks || { youtube: "", instagram: "", linkedin: "", x: "", facebook: "", whatsapp: "" });
        setCards(data.introCards || []);
      }
    } catch (error) {
      toast.error("Failed to fetch Home content");
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
      await axios.put("https://my-life-website.onrender.com/api/homepage/hero", heroForm, { withCredentials: true });
      toast.success("Hero updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSocial = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await axios.put("https://my-life-website.onrender.com/api/homepage/social", socialLinks, { withCredentials: true });
      toast.success("Social links updated!");
      fetchData();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveCard = async (e) => {
    e.preventDefault();
    let newCards = [...cards];
    if (cardModal.isEdit) newCards[cardModal.index] = cardModal.data;
    else newCards.push(cardModal.data);

    try {
      await axios.put("https://my-life-website.onrender.com/api/homepage/cards", { cards: newCards }, { withCredentials: true });
      toast.success("Cards updated!");
      setCardModal({ ...cardModal, isOpen: false });
      fetchData();
    } catch (error) {
      toast.error("Failed to update cards");
    }
  };

  const handleDeleteCard = async (index) => {
    if (!window.confirm("Delete card?")) return;
    const newCards = cards.filter((_, i) => i !== index);
    try {
      await axios.put("https://my-life-website.onrender.com/api/homepage/cards", { cards: newCards }, { withCredentials: true });
      toast.success("Card deleted!");
      fetchData();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  const handleAddImage = (url) => {
    if (imageModal.target === "main") {
      setHeroForm({ ...heroForm, mainImage: url });
    } else if (imageModal.target === "cardStack") {
      setHeroForm({ ...heroForm, cardImages: [...(heroForm.cardImages || []), url] });
    } else {
      setHeroForm({ ...heroForm, images: [...heroForm.images, url] });
    }
    setImageModal({ isOpen: false, url: "", target: "carousel" });
  };

  const removeCarouselImage = (index) => {
    const newImages = heroForm.images.filter((_, i) => i !== index);
    setHeroForm({ ...heroForm, images: newImages });
  };

  const removeCardImage = (index) => {
    const newImages = heroForm.cardImages.filter((_, i) => i !== index);
    setHeroForm({ ...heroForm, cardImages: newImages });
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] p-12 space-y-12">
      <SkeletonBase className="h-10 w-64 rounded-lg" />
      <div className="flex gap-4">
        <SkeletonBase className="h-12 w-32 rounded-xl" />
        <SkeletonBase className="h-12 w-32 rounded-xl" />
      </div>
      <SkeletonBase className="h-[600px] w-full rounded-[2.5rem]" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">System Overview</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Landing Page Manager
          </h1>
        </header>

        {/* TABS */}
        <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl w-fit">
          <button onClick={() => setActiveTab("hero")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "hero" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Sparkles className="w-4 h-4" /> Hero Settings
          </button>
          <button onClick={() => setActiveTab("cards")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "cards" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Box className="w-4 h-4" /> Feature Cards
          </button>
          <button onClick={() => setActiveTab("social")} className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "social" ? "bg-orange-500 shadow-lg shadow-orange-500/20" : "text-gray-400 hover:text-white"}`}>
            <Cloud className="w-4 h-4" /> Social Assets
          </button>
        </div>

        {activeTab === "hero" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            {/* HERO FORM */}
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
               <h2 className="text-xl font-bold mb-8 flex items-center gap-3">Hero Content</h2>
               <form onSubmit={handleUpdateHero} className="space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Badge Text</label>
                      <input type="text" value={heroForm.badgeText} onChange={e => setHeroForm({...heroForm, badgeText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Main Heading</label>
                      <input type="text" value={heroForm.heading} onChange={e => setHeroForm({...heroForm, heading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Sub-heading / Description</label>
                      <textarea rows="3" value={heroForm.subheading} onChange={e => setHeroForm({...heroForm, subheading: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"></textarea>
                    </div>
                 </div>

                 {/* IMAGES */}
                 <div className="space-y-6">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest border-b border-white/5 pb-2">Visual Assets</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                       {/* Carousel Images */}
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-gray-500 uppercase">Background Carousel</label>
                             <button type="button" onClick={() => setImageModal({ isOpen: true, url: "", target: "carousel" })} className="text-orange-500 hover:text-orange-400 transition-colors"><Plus size={20}/></button>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             {heroForm.images.map((img, i) => (
                               <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-white/10 group">
                                  <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all" />
                                  <button type="button" onClick={() => removeCarouselImage(i)} className="absolute top-1 right-1 p-1 bg-red-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={12}/></button>
                               </div>
                             ))}
                          </div>
                       </div>
                       {/* Main Featured Image Stack */}
                       <div className="space-y-4">
                          <div className="flex justify-between items-center">
                             <label className="text-[10px] font-bold text-gray-500 uppercase block">Featured Stack (Right Side)</label>
                             <button type="button" onClick={() => setImageModal({ isOpen: true, url: "", target: "cardStack" })} className="text-orange-500 hover:text-orange-400 transition-colors"><Plus size={20}/></button>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                             {heroForm.cardImages?.map((img, i) => (
                                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                                   <img src={img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all" />
                                   <button type="button" onClick={() => removeCardImage(i)} className="absolute top-2 right-2 p-2 bg-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16}/></button>
                                   <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 rounded-md text-[8px] font-bold uppercase tracking-tighter text-white">Position {i+1}</div>
                                </div>
                             ))}
                             {(!heroForm.cardImages || heroForm.cardImages.length === 0) && (
                                <div className="aspect-square rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600 gap-2">
                                   <ImageIcon size={24} />
                                   <span className="text-[9px] font-bold uppercase">No Images Stacked</span>
                                </div>
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex justify-end pt-6 border-t border-white/5">
                    <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                      <Save size={18} /> {isUpdating ? "Syncing..." : "Update Landing Page"}
                    </button>
                 </div>
               </form>
            </div>
          </motion.div>
        )}

        {activeTab === "cards" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-8 rounded-[2rem] backdrop-blur-xl">
               <h2 className="text-xl font-bold flex items-center gap-3"><Box className="text-orange-500 w-5 h-5" /> Introduction Cards</h2>
               <button onClick={() => setCardModal({ isOpen: true, isEdit: false, data: { title: "", description: "", icon: "Cloud" }, index: null })} className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
                  <Plus size={16} className="text-orange-500" /> New Card
               </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
               {cards.map((card, i) => (
                 <div key={i} className="group bg-white/[0.02] border border-white/10 p-8 rounded-[2.5rem] relative overflow-hidden backdrop-blur-xl hover:bg-white/[0.04] transition-all">
                    <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 text-orange-500 group-hover:scale-110 transition-transform">
                       <DynamicIcon name={card.icon} className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{card.description}</p>
                    <div className="flex gap-2 mt-8 opacity-0 group-hover:opacity-100 transition-all">
                       <button onClick={() => setCardModal({ isOpen: true, isEdit: true, data: card, index: i })} className="p-3 bg-white/5 rounded-xl text-blue-400 hover:bg-blue-400/10"><Edit size={16}/></button>
                       <button onClick={() => handleDeleteCard(i)} className="p-3 bg-white/5 rounded-xl text-red-400 hover:bg-red-400/10"><Trash2 size={16}/></button>
                    </div>
                 </div>
               ))}
            </div>
          </motion.div>
        )}

        {activeTab === "social" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
               <h2 className="text-xl font-bold mb-8 flex items-center gap-3">Social Connectivity</h2>
               <form onSubmit={handleUpdateSocial} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                     {Object.keys(socialLinks).map((platform) => (
                       <div key={platform} className="space-y-2">
                         <label className="text-[10px] font-bold text-gray-500 uppercase px-1">{platform} Profile URL</label>
                         <div className="relative">
                            <input 
                              type="text" 
                              value={socialLinks[platform]} 
                              onChange={e => setSocialLinks({...socialLinks, [platform]: e.target.value})} 
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50" 
                              placeholder={`https://${platform}.com/...`}
                            />
                         </div>
                       </div>
                     ))}
                  </div>

                  <div className="flex justify-end pt-6 border-t border-white/5">
                     <button type="submit" disabled={isUpdating} className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50">
                       <Save size={18} /> {isUpdating ? "Syncing..." : "Update Social Infrastructure"}
                     </button>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {(cardModal.isOpen || imageModal.isOpen) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setCardModal({ ...cardModal, isOpen: false }); setImageModal({ ...imageModal, isOpen: false }); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-orange-600" />
                
                {cardModal.isOpen && (
                  <form onSubmit={handleSaveCard} className="space-y-6">
                     <h3 className="text-2xl font-black">{cardModal.isEdit ? "Modify Card" : "New Card"}</h3>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Icon Symbol</label>
                        <select value={cardModal.data.icon} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, icon: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none text-white">
                           {Object.keys(IconMap).map(icon => <option key={icon} value={icon} className="bg-[#0d0d0d]">{icon}</option>)}
                        </select>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Card Title</label>
                        <input required type="text" value={cardModal.data.title} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, title: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Description</label>
                        <textarea required rows="3" value={cardModal.data.description} onChange={e => setCardModal({...cardModal, data: {...cardModal.data, description: e.target.value}})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none"></textarea>
                     </div>
                     <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Finalize Card</button>
                  </form>
                )}

                {imageModal.isOpen && (
                   <div className="space-y-6">
                      <h3 className="text-2xl font-black">Asset Integration</h3>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase px-1">Asset URL</label>
                        <input required type="text" value={imageModal.url} onChange={e => setImageModal({...imageModal, url: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none" placeholder="https://..." />
                      </div>
                      <button onClick={() => handleAddImage(imageModal.url)} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest transition-all">Apply Asset</button>
                   </div>
                )}
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminHome;
