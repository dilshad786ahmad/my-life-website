import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { CheckCircle2, Calendar, User, Briefcase, ExternalLink, MessageCircle, Star, ArrowRight, Sparkles, Layout, Filter } from "lucide-react";
import Breadcrumb from "./Breadcrumb";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  
  // Review Form State
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "", user: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projectdetails/${projectId}`);
        setDetails(res.data.data);
        setActiveImage(res.data.data.mainImage);
      } catch (error) {
        console.error("Error fetching project details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [projectId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewForm.text || !reviewForm.user) {
        return toast.error("Please fill all review fields");
    }
    setIsSubmittingReview(true);
    try {
        const res = await axios.post(`http://localhost:5000/api/projectdetails/review`, {
            projectId,
            ...reviewForm
        });
        setDetails(res.data.data);
        setReviewForm({ rating: 5, text: "", user: "" });
        toast.success("Review submitted! Thank you.");
    } catch (error) {
        toast.error("Failed to submit review");
    } finally {
        setIsSubmittingReview(false);
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] -z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-16 relative z-10">
        <Breadcrumb customTitle={details?.title} />
        
        {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-4">
                        <div className="h-6 w-32 bg-white/5 rounded-full animate-pulse"></div>
                        <div className="h-16 w-3/4 bg-white/5 rounded-2xl animate-pulse"></div>
                        <div className="h-10 w-1/2 bg-white/5 rounded-xl animate-pulse"></div>
                    </div>
                    <div className="aspect-video bg-white/5 rounded-[2.5rem] animate-pulse"></div>
                </div>
                <div className="lg:col-span-1 h-[600px] bg-white/5 rounded-[2.5rem] animate-pulse"></div>
            </div>
        ) : !details ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-white px-6">
                <h2 className="text-4xl font-black mb-4">No Data Found</h2>
                <p className="text-gray-500 mb-8 uppercase tracking-widest">Details for this project have not been registered yet.</p>
                <button onClick={() => window.history.back()} className="px-8 py-3 bg-orange-500 rounded-xl font-bold uppercase text-xs tracking-widest">Go Back</button>
            </div>
        ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">

                {/* LEFT CONTENT: HERO & CASE STUDY */}
                <div className="lg:col-span-2 space-y-12 mt-10">
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5 m text-orange-500 animate-pulse" />
                      <span className="text-[10px] font-black tracking-[0.3em] text-gray-300 uppercase">{details.caseStudyBadge}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1]">{details.title}</h1>
                    <div className="flex items-center gap-3 mb-8">
                       <div className="h-[1px] w-12 bg-orange-500"></div>
                       <button 
                        onClick={() => navigate('/projects', { state: { selectedCategory: details.category } })}
                        className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-orange-500 hover:text-orange-400 transition-colors"
                       >
                        {details.category}
                       </button>
                    </div>
                    <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mb-4 italic">"{details.subtitle}"</p>
                    <p className="text-sm md:text-base text-gray-500 leading-relaxed max-w-3xl border-l-2 border-white/5 pl-6">
                      {details.description || "Detailed project documentation is currently being synchronized. This section will contain the full conceptual overview and strategic objectives of the project."}
                    </p>
                  </motion.div>

                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="space-y-6">
                    <div className="rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-video md:aspect-video max-w-4xl mx-auto relative group">
                      <AnimatePresence mode="wait">
                          <motion.img
                            key={activeImage}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            src={activeImage || null}
                            className="w-full h-full object-cover"
                            alt="Active View"
                          />
                      </AnimatePresence>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/40 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
                      {[details.mainImage, ...details.thumbnails].map((img, i) => (
                        <motion.div 
                          key={i}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => setActiveImage(img)}
                          className={`w-24 h-16 md:w-32 md:h-20 shrink-0 rounded-xl md:rounded-2xl overflow-hidden border cursor-pointer shadow-xl relative group transition-all ${activeImage === img ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-white/10'}`}
                        >
                          <img src={img || null} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-white italic">{details.challengeTitle}</h3>
                      <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed">{details.challengeDescription}</p>
                    </div>
                    <div className="space-y-4 md:space-y-6">
                      <h3 className="text-xl md:text-2xl font-black tracking-tight text-white italic">{details.outcomesTitle}</h3>
                      <ul className="space-y-3 md:space-y-4">
                        {details.outcomesList?.map((item, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-400">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-orange-500 shrink-0" />
                            <span className="text-xs md:text-sm font-medium">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDEBAR: PROJECT BRIEF */}
                <div className="lg:col-span-1">
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:sticky lg:top-40 bg-[#0d0d0d] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
                    <h3 className="text-xl md:text-2xl font-black text-white tracking-tighter mb-8 italic">Project Brief</h3>
                    <div className="space-y-6 md:space-y-8 mb-10">
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/10 transition-colors"><Calendar className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Timeline</p>
                          <p className="text-xs md:text-sm font-bold text-white">{details.projectBrief?.timeline}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-400/10 transition-colors"><User className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Client</p>
                          <p className="text-xs md:text-sm font-bold text-white">{details.projectBrief?.client}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500/10 transition-colors"><Briefcase className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Role</p>
                          <p className="text-xs md:text-sm font-bold text-white">{details.role || details.projectBrief?.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigate('/projects', { state: { selectedCategory: details.category || "Big Project" } })}>
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-400/10 transition-colors"><Layout className="w-5 h-5" /></div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Category</p>
                          <p className="text-xs md:text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{details.category || "Big Project"}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 transition-all group-hover:text-white group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] font-black text-xs">$</div>
                        <div>
                          <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Project Value</p>
                          <div className="flex items-baseline gap-2">
                             <p className="text-xl md:text-2xl font-black text-orange-500">${details.price || "0"}</p>
                             {details.originalPrice > details.price && (
                                <p className="text-xs md:text-sm font-bold text-gray-600 line-through">${details.originalPrice}</p>
                             )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-white/5 mb-10">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-4 px-1">Classification</h4>
                        
                        {/* Desktop: Vertical List */}
                        <div className="hidden md:flex flex-col gap-3">
                            {["AI Integrated Project", "Mini Project", "Medium Project", "Big Project"].map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => navigate('/projects', { state: { selectedCategory: cat } })}
                                    className={`flex items-center justify-between group/cat text-left ${details.category === cat ? 'pointer-events-none' : ''}`}
                                >
                                    <span className={`text-[10px] font-bold transition-colors uppercase tracking-widest ${details.category === cat ? 'text-orange-500' : 'text-gray-400 group-hover/cat:text-orange-500'}`}>{cat}</span>
                                    <ArrowRight className={`w-3 h-3 transition-all ${details.category === cat ? 'text-orange-500 translate-x-1' : 'text-gray-700 group-hover/cat:text-orange-500 group-hover/cat:translate-x-1'}`} />
                                </button>
                            ))}
                        </div>

                        {/* Mobile: Simple CTA */}
                        <button 
                            onClick={() => navigate('/project')}
                            className="md:hidden w-full bg-white/5 border border-white/10 py-4 rounded-2xl flex items-center justify-between px-6 group"
                        >
                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Browse All Categories</span>
                            <Filter className="w-4 h-4 text-orange-500 group-active:rotate-12 transition-transform" />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {details.techStack?.map(tag => (
                        <span key={tag} className="text-[8px] md:text-[9px] font-black uppercase tracking-widest px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-gray-400">{tag}</span>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <a href={details.liveLink || "#"} target="_blank" rel="noreferrer" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 group">
                        Live Preview <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                      <button className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" /> Message Developer
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* BOTTOM CONTENT: RATINGS & FEEDBACK */}
              <div className="mt-16 md:mt-24 pt-16 border-t border-white/5">
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-4 italic">{details.socialProofTitle}</h3>
                    <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-black">Trusted by industry leaders</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
                  <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 text-center flex flex-col justify-center items-center shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform"></div>
                    <h4 className="text-4xl md:text-6xl font-black text-white mb-2">{details.overallRating}</h4>
                    <div className="flex gap-1 text-orange-500 mb-2">
                      {[1,2,3,4,5].map(i => <Star key={i} className={`w-4 h-4 ${i <= Math.round(details.overallRating) ? 'fill-current' : 'text-gray-700'}`} />)}
                    </div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Performance Metrics</p>
                  </div>

                  {details.reviews?.map((r, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-3xl relative shadow-xl hover:border-white/10 transition-colors">
                      <div className="flex gap-1 text-orange-500 mb-4">
                        {[1,2,3,4,5].map(star => <Star key={star} className={`w-3 h-3 ${star <= r.rating ? 'fill-current' : 'text-gray-700'}`} />)}
                      </div>
                      <p className="text-gray-400 text-xs md:text-sm font-light italic leading-relaxed">"{r.text}"</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-black text-orange-500 uppercase">{r.user[0]}</div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">{r.user}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Review Submission Form */}
                <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-50"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg md:text-xl font-black text-white tracking-tight mb-8">Share Your Experience</h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Name</label>
                              <input required value={reviewForm.user} onChange={e => setReviewForm({...reviewForm, user: e.target.value})} placeholder="Enter name..." className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-orange-500/50 transition-all text-white" />
                          </div>
                          <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Rating</label>
                              <div className="flex items-center gap-2 bg-black/40 border border-white/10 p-4 rounded-2xl h-[54px]">
                                  {[1,2,3,4,5].map(i => <Star key={i} onClick={() => setReviewForm({...reviewForm, rating: i})} className={`w-4 h-4 cursor-pointer transition-colors ${i <= reviewForm.rating ? 'text-orange-500 fill-current' : 'text-gray-700'}`} />)}
                              </div>
                          </div>
                      </div>
                      <div className="space-y-2 mb-8">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Your Feedback</label>
                          <textarea required value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} placeholder="How was your experience?" className="w-full bg-black/40 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-orange-500/50 transition-all text-white min-h-[120px]" />
                      </div>
                      <button disabled={isSubmittingReview} className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-orange-500/20">
                          {isSubmittingReview ? "SUBMITTING..." : "SUBMIT REVIEW"}
                      </button>
                    </form>
                  </div>
                </motion.div>
              </div>
            </>
        )}
      </div>
    </div>
  );
}
