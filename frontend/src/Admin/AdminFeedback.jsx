import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, Edit2, Trash2, Calendar, X
} from 'lucide-react';
import toast from 'react-hot-toast';

const TableSkeleton = ({ count = 5 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-white/5">
        <td className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/5 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/10 rounded"></div>
              <div className="h-2 w-16 bg-white/5 rounded"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-6"><div className="h-4 w-16 bg-white/5 rounded"></div></td>
        <td className="px-6 py-6"><div className="h-4 w-48 bg-white/5 rounded"></div></td>
        <td className="px-6 py-6"><div className="h-6 w-16 bg-white/5 rounded-full"></div></td>
        <td className="px-6 py-6 text-right"><div className="h-8 w-8 bg-white/5 rounded ml-auto"></div></td>
      </tr>
    ))}
  </>
);

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showingDetails, setShowingDetails] = useState("Showing 0 entries");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const dateInputRef = useRef(null);

  const [editModalData, setEditModalData] = useState(null);

  const fetchFeedbacks = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/feedback/admin', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: statusFilter,
          startDate: dateRange.start,
          endDate: dateRange.end
        }
      });
      const result = response.data;
      if (result.success) {
        setFeedbacks(result.data || []);
        setPagination(result.pagination || {});
        setShowingDetails(`Showing ${result.data?.length || 0} of ${result.total || 0} entries`);
      }
    } catch (error) {
      console.error("Admin Feedback Error:", error);
      setFeedbacks([]);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, dateRange]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this feedback?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/feedback/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        toast.success("Feedback deleted successfully");
        fetchFeedbacks();
      } catch (err) { 
        toast.error("Delete failed"); 
      }
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/feedback/admin/${editModalData._id}`, {
        status: editModalData.status,
        name: editModalData.name,
        email: editModalData.email,
        rating: editModalData.rating,
        comment: editModalData.comment
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      toast.success("Feedback updated successfully");
      setEditModalData(null);
      fetchFeedbacks();
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleButtonClick = () => { if (dateInputRef.current) dateInputRef.current.showPicker(); };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <AnimatePresence>
        {editModalData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalData(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-lg max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic">Edit Feedback</h3>
                <button onClick={() => setEditModalData(null)} className="text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Status</label>
                  <select
                    value={editModalData.status}
                    onChange={(e) => setEditModalData({ ...editModalData, status: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50"
                  >
                    <option value="pending" className="bg-[#0d0d0d]">Pending</option>
                    <option value="approved" className="bg-[#0d0d0d]">Approved</option>
                    <option value="rejected" className="bg-[#0d0d0d]">Rejected</option>
                    <option value="deleted" className="bg-[#0d0d0d]">Deleted</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Name</label>
                    <input type="text" value={editModalData.name} onChange={(e) => setEditModalData({ ...editModalData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Email</label>
                    <input type="email" value={editModalData.email || ""} onChange={(e) => setEditModalData({ ...editModalData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Rating (1-5)</label>
                    <input type="number" min="1" max="5" value={editModalData.rating} onChange={(e) => setEditModalData({ ...editModalData, rating: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-2">Comment</label>
                  <textarea rows="4" value={editModalData.comment} onChange={(e) => setEditModalData({ ...editModalData, comment: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"></textarea>
                </div>
              </div>
              <div className="mt-8 flex gap-4">
                <button onClick={() => setEditModalData(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all">Dismiss</button>
                <button onClick={handleEditSubmit} className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 transition-all">Update</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter">Manage Feedback</h1>
        </header>

        <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-10 backdrop-blur-2xl relative shadow-3xl overflow-hidden">
           <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-gray-500 absolute left-6 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <select
                  className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] px-6 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="all" className="bg-[#0d0d0d]">Status: All</option>
                  <option value="approved" className="bg-[#0d0d0d]">Approved</option>
                  <option value="pending" className="bg-[#0d0d0d]">Pending</option>
                  <option value="rejected" className="bg-[#0d0d0d]">Rejected</option>
                  <option value="deleted" className="bg-[#0d0d0d]">Deleted (By Client)</option>
                </select>

                <button onClick={handleButtonClick} className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] px-6 py-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                  {dateRange.start || "Filter by Date"} <Calendar className="w-4 h-4 text-orange-500" />
                </button>
                <input type="date" ref={dateInputRef} onChange={(e) => setDateRange({start: e.target.value, end: e.target.value})} className="absolute opacity-0 pointer-events-none" />
              </div>
           </div>

           <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-white/[0.01]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-6 py-5 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Client</th>
                    <th className="px-6 py-5 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Rating</th>
                    <th className="px-6 py-5 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Feedback</th>
                    <th className="px-6 py-5 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-5 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <TableSkeleton />
                  ) : feedbacks.length > 0 ? (
                    feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-white/[0.02] transition-all group">
                        <td className="px-6 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-lg">
                              {fb.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-sm">{fb.name}</div>
                              <div className="text-[10px] text-gray-500">{fb.email || "Verified Client"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="flex gap-0.5">
                             {[...Array(5)].map((_, i) => (
                               <Star key={i} className={`w-4 h-4 ${i < fb.rating ? "text-orange-500 fill-orange-500" : "text-gray-600"}`} />
                             ))}
                           </div>
                        </td>
                        <td className="px-6 py-6">
                           <div className="max-w-xs truncate text-gray-400 italic">"{fb.comment}"</div>
                           <div className="text-[10px] text-gray-600 mt-1">{new Date(fb.createdAt).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            fb.status === 'approved' ? 'bg-green-500/10 text-green-500' : 
                            fb.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                            fb.status === 'deleted' ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20 line-through' :
                            'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {fb.status}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setEditModalData(fb)} className="p-2 rounded-lg bg-white/5 hover:bg-orange-500/10 hover:text-orange-400 transition-colors border border-white/5"><Edit2 size={16} /></button>
                            <button onClick={() => handleDelete(fb._id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-colors border border-white/5"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-20 text-gray-600">No feedback found.</td></tr>
                  )}
                </tbody>
              </table>
           </div>

           <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{showingDetails}</span>
              <div className="flex gap-2">
                <button disabled={!pagination.prev} onClick={() => setCurrentPage(p => p - 1)} className="px-6 py-2 bg-white/5 text-[10px] font-bold uppercase rounded-lg disabled:opacity-30 hover:bg-white/10">Prev</button>
                <button disabled={!pagination.next} onClick={() => setCurrentPage(p => p + 1)} className="px-6 py-2 bg-white/5 text-[10px] font-bold uppercase rounded-lg disabled:opacity-30 hover:bg-white/10">Next</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
