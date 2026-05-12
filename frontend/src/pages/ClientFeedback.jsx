import React, { useState, useEffect } from "react";
import axios from "axios";
import { Star, Edit3, X, User, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Breadcrumb from "../components/Breadcrumb";
import { motion, AnimatePresence } from "framer-motion";
import { CardSkeleton } from "../components/Skeleton";

export default function ClientFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.username || user?.name || "",
    email: user?.email || "",
    rating: 5,
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get("https://my-life-website.onrender.com/api/feedback/public");
      setFeedbacks(res.data.data);
    } catch (error) {
      console.error("Failed to fetch feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = async () => {
    setIsModalOpen(true);
    if (user) {
      try {
        const res = await axios.get("https://my-life-website.onrender.com/api/feedback/me", { withCredentials: true });
        if (res.data.success && res.data.data) {
          setFormData({
            name: res.data.data.name || user?.username || "",
            email: res.data.data.email || user?.email || "",
            rating: res.data.data.rating,
            comment: res.data.data.comment,
          });
        }
      } catch (error) {
        // If 404, it means no feedback exists yet, which is fine.
        if (error.response?.status !== 404) {
          console.error("Failed to fetch user feedback:", error);
        }
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRating = (rate) => {
    setFormData({ ...formData, rating: rate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit feedback.");
      return;
    }
    setSubmitting(true);
    try {
      await axios.post("https://my-life-website.onrender.com/api/feedback", formData, { withCredentials: true });
      toast.success("Feedback submitted successfully!");
      setIsModalOpen(false);
      fetchFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMyFeedback = async () => {
    if (!window.confirm("Are you sure you want to delete your feedback?")) return;
    try {
      await axios.delete("https://my-life-website.onrender.com/api/feedback/me", { withCredentials: true });
      toast.success("Feedback deleted successfully!");
      fetchFeedbacks(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete feedback");
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen px-6 pt-32 pb-20 font-sans text-white relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb />
        
        {/* Header Section */}
        <div className="mb-16 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 mb-6 tracking-tight">
            Client Feedback
          </h2>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light mb-8">
            Hear from the organizations that trust us to deliver excellence, drive operational efficiency, and architect scalable solutions.
          </p>
          
          {user && (
            <button 
              onClick={openModal}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
            >
              <Edit3 className="w-4 h-4" /> Add / Edit Your Feedback
            </button>
          )}
        </div>

        {/* Feedback Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[250px]"><CardSkeleton /></div>
            ))
          ) : feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <motion.div 
                key={fb._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-colors backdrop-blur-sm shadow-[0_4px_20px_rgba(0,0,0,0.1)] ${
                  fb.isAdmin 
                    ? "bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/40"
                    : "bg-orange-50/5 border border-orange-500/10 hover:bg-orange-50/10"
                }`}
              >
                {fb.isAdmin && (
                  <div className="absolute -top-3 -right-3">
                    <span className="relative flex h-6 w-6">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-orange-500 border-2 border-[#050505] items-center justify-center">
                        <Star className="w-3 h-3 text-white fill-white" />
                      </span>
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < fb.rating ? "text-orange-500 fill-orange-500" : "text-gray-600"}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">
                    "{fb.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-900/30 flex items-center justify-center border border-orange-500/20 overflow-hidden shrink-0">
                    {fb.avatar ? (
                      <img src={fb.avatar} alt={fb.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-orange-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black uppercase tracking-widest text-white">{fb.name}</h4>
                      {fb.isAdmin && (
                        <span className="bg-orange-500/20 text-orange-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-orange-500/30">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{fb.email || "Verified Client"} • {new Date(fb.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {user && (user._id === (fb.user?._id || fb.user) || user.id === (fb.user?._id || fb.user)) && (
                  <div className="absolute top-6 right-6 flex items-center gap-4">
                    <button 
                      onClick={() => openModal()}
                      className="text-gray-500 hover:text-orange-500 transition-colors"
                      title="Edit your feedback"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleDeleteMyFeedback}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                      title="Delete your feedback"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-500">
              No feedback available yet.
            </div>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Feedback */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-10 w-full max-w-xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h3 className="text-2xl font-black text-white mb-2">Your Feedback</h3>
              <p className="text-gray-500 text-sm mb-8">Share your experience with us.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Name</label>
                    <input type="text" name="name" value={formData.name} readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Email</label>
                    <input type="email" name="email" value={formData.email} readOnly
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gray-400 cursor-not-allowed focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Rating</label>
                  <div className="flex gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} type="button" onClick={() => handleRating(star)} className="focus:outline-none">
                        <Star className={`w-6 h-6 transition-colors ${formData.rating >= star ? "text-orange-500 fill-orange-500" : "text-gray-600 hover:text-orange-400"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Your Review</label>
                  <textarea name="comment" value={formData.comment} onChange={handleChange} required rows={4} placeholder="Tell us how we helped you..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-4 mt-4">
                  <button type="submit" disabled={submitting}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {submitting ? "Submitting..." : "Submit Feedback"}
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      handleDeleteMyFeedback();
                      setIsModalOpen(false);
                    }}
                    className="px-6 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 rounded-xl transition-all active:scale-95 flex items-center justify-center"
                    title="Delete Feedback"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
