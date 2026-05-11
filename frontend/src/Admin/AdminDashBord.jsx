import React, { useRef, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, HelpCircle, Users, ClipboardList, CheckCircle2,
  Calendar, Edit2, Trash2, Menu, X, ArrowRight
} from 'lucide-react';

// --- Skeleton Component for Table Rows ---
const TableSkeleton = ({ count = 5 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <tr key={i} className="animate-pulse border-b border-white/5">
        <td className="px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/5 rounded-2xl"></div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/10 rounded"></div>
              <div className="h-2 w-16 bg-white/5 rounded"></div>
            </div>
          </div>
        </td>
        <td className="px-6 py-6"><div className="h-4 w-32 bg-white/5 rounded"></div></td>
        <td className="px-6 py-6"><div className="h-4 w-48 bg-white/5 rounded"></div></td>
        <td className="px-6 py-6"><div className="h-4 w-24 bg-white/5 rounded"></div></td>
        <td className="px-6 py-6"><div className="h-6 w-16 bg-white/5 rounded-full"></div></td>
        <td className="px-6 py-6 text-right"><div className="h-8 w-8 bg-white/5 rounded ml-auto"></div></td>
      </tr>
    ))}
  </>
);

const ColorMap = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    text: "text-blue-400",
    glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]"
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    text: "text-orange-400",
    glow: "shadow-[0_0_20px_rgba(249,115,22,0.1)]"
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    text: "text-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]"
  }
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalLeads: 0, totalPending: 0, totalInterested: 0, totalTalkToLater: 0 });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [showingDetails, setShowingDetails] = useState("Showing 0 entries");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [leadStatusTab, setLeadStatusTab] = useState("pending");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const dateInputRef = useRef(null);

  const [editModalData, setEditModalData] = useState(null);

  const fetchUsers = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/admin/', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
        params: {
          page: currentPage,
          limit: 10,
          search: searchTerm,
          status: statusFilter,
          leadStatus: leadStatusTab,
          startDate: dateRange.start,
          endDate: dateRange.end
        }
      });
      const result = response.data;
      if (result.success) {
        setUsers(result.data || []);
        setStats(result.stats || { totalLeads: 0, totalPending: 0, totalInterested: 0, totalTalkToLater: 0 });
        setPagination(result.pagination || {});
        setShowingDetails(result.showingDetails || `Showing ${result.data?.length || 0} entries`);
      }
    } catch (error) {
      console.error("Admin Dashboard Error:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, leadStatusTab, dateRange]);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 60000); 
    return () => clearInterval(interval);
  }, [fetchUsers]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this user record?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:5000/api/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });
        fetchUsers();
      } catch (err) { console.error("Delete failed:", err); }
    }
  };

  const handleEditSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/admin/${editModalData.id}`, {
        query: editModalData.query,
        leadStatus: editModalData.leadStatus
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      setEditModalData(null);
      fetchUsers();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleButtonClick = () => { if (dateInputRef.current) dateInputRef.current.showPicker(); };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <AnimatePresence>
        {editModalData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditModalData(null)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-orange-500 to-orange-600" />
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black italic">Refine Lead</h3>
                <button onClick={() => setEditModalData(null)} className="text-gray-500 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-3">Lead Classification</label>
                  <select
                    value={editModalData.leadStatus}
                    onChange={(e) => setEditModalData({ ...editModalData, leadStatus: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  >
                    <option value="pending" className="bg-[#0d0d0d]">Pending Review</option>
                    <option value="interested" className="bg-[#0d0d0d]">Qualified Interest</option>
                    <option value="not interested" className="bg-[#0d0d0d]">Not Interested</option>
                    <option value="talk to later" className="bg-[#0d0d0d]">Follow-up Later</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest text-gray-500 uppercase mb-3">Contextual Note</label>
                  <textarea
                    value={editModalData.query}
                    onChange={(e) => setEditModalData({ ...editModalData, query: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    rows="4"
                    placeholder="Internal query context..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-10 flex gap-4">
                <button onClick={() => setEditModalData(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl border border-white/10 transition-all">Dismiss</button>
                <button onClick={handleEditSubmit} className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-orange-500/20 transition-all">Synchronize</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <header className="mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
            <span className="text-[10px] font-black tracking-[0.3em] text-gray-400 uppercase">Strategic Infrastructure</span>
          </div>
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 tracking-tighter">Command Center</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { label: "Live Inquiries", value: stats.totalLeads, icon: Users, color: "blue", sub: "Total global reach" },
            { label: "Active Review", value: stats.totalPending, icon: ClipboardList, color: "orange", sub: "Awaiting response" },
            { label: "Converted", value: stats.totalInterested, icon: CheckCircle2, color: "emerald", sub: "Qualified leads" }
          ].map((stat, idx) => {
            const theme = ColorMap[stat.color];
            return (
              <div key={idx} className={`bg-white/[0.02] border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-xl transition-all hover:bg-white/[0.04] ${theme.glow}`}>
                {loading ? (
                  <div className="animate-pulse">
                    <div className="w-14 h-14 bg-white/5 rounded-2xl mb-8"></div>
                    <div className="h-10 w-24 bg-white/5 rounded"></div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 ${theme.bg} ${theme.border} rounded-2xl flex items-center justify-center`}>
                        <stat.icon className={`w-7 h-7 ${theme.text}`} />
                      </div>
                      <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{stat.label}</span>
                    </div>
                    <h2 className="text-5xl font-black text-white">{stat.value}</h2>
                    <p className="text-xs text-gray-500 mt-3 font-medium">{stat.sub}</p>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-10 backdrop-blur-2xl relative shadow-3xl overflow-hidden">
           <div className="flex flex-col lg:flex-row justify-between gap-8 mb-10">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-gray-500 absolute left-6 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Query search..."
                  className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-[1.5rem] text-sm text-white outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <select
                  className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] px-8 py-4 outline-none focus:ring-2 focus:ring-orange-500/50"
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                >
                  <option value="" className="bg-[#0d0d0d]">Status: All</option>
                  <option value="online" className="bg-[#0d0d0d]">Live</option>
                  <option value="offline" className="bg-[#0d0d0d]">Archived</option>
                </select>

                <button onClick={handleButtonClick} className="bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] px-8 py-4 flex items-center gap-4 hover:bg-white/10 transition-all">
                  {dateRange.start || "Timeline"} <Calendar className="w-4 h-4 text-orange-500" />
                </button>
                <input type="date" ref={dateInputRef} onChange={(e) => setDateRange({start: e.target.value, end: e.target.value})} className="absolute opacity-0 pointer-events-none" />
              </div>
           </div>

           <div className="flex gap-10 border-b border-white/5 mb-10 overflow-x-auto scrollbar-hide px-2">
              {['pending', 'interested', 'not interested', 'talk to later'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setLeadStatusTab(tab); setCurrentPage(1); }}
                  className={`pb-5 text-[10px] font-black tracking-[0.2em] uppercase transition-all relative ${
                    leadStatusTab === tab ? "text-white" : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {tab}
                    <span className={`w-1.5 h-1.5 rounded-full ${leadStatusTab === tab ? "bg-orange-500" : "bg-transparent"}`}></span>
                  </span>
                  {leadStatusTab === tab && (
                    <motion.div layoutId="admin-nav-indicator" className="absolute bottom-0 left-0 w-full h-[3px] bg-orange-500" />
                  )}
                </button>
              ))}
           </div>

           <div className="overflow-x-auto rounded-[2rem] border border-white/5 bg-white/[0.01]">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="bg-white/[0.03] border-b border-white/5">
                    <th className="px-8 py-6 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Principal</th>
                    <th className="px-8 py-6 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Intelligence</th>
                    <th className="px-8 py-6 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Activity</th>
                    <th className="px-8 py-6 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-8 py-6 font-black text-[10px] text-gray-500 uppercase tracking-[0.2em] text-right">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    <TableSkeleton />
                  ) : users.length > 0 ? (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-white/[0.02] transition-all group">
                        <td className="px-8 py-8">
                          <div className="flex items-center gap-5">
                            {user.avatar ? (
                              <img 
                                src={user.avatar || null} 
                                alt={user.username} 
                                className="w-14 h-14 rounded-[1.25rem] object-cover shadow-lg shadow-orange-500/10 border border-white/10"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-500/20">
                                {user.username?.charAt(0).toUpperCase() || '?'}
                              </div>
                            )}
                            <div>
                              <div className="font-black text-white text-base flex items-center gap-2">
                                {user.username}
                                <span className={`text-[8px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter ${
                                  user.authProvider === 'google' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                }`}>
                                  {user.authProvider || 'Email'}
                                </span>
                              </div>
                              <div className="text-[10px] text-gray-600 font-mono">#{user._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                           <div className="max-w-[300px] truncate text-gray-400 font-light italic">"{user.query || 'N/A'}"</div>
                           <div className="text-[10px] text-orange-500/70 font-black uppercase tracking-tighter mt-2">{user.country || 'Global Origin'}</div>
                        </td>
                        <td className="px-8 py-8">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-16 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-500" style={{ width: `${Math.min((user.loginCount || 0) * 10, 100)}%` }}></div>
                              </div>
                              <span className="text-[10px] font-black text-gray-400">{user.loginCount || 0} LOGINS</span>
                            </div>
                            <span className="text-[10px] text-gray-600 font-medium tracking-wide">LAST: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'INITIAL'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-8">
                          <span className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            user.status === 'online' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`}></span>
                            {user.status || 'offline'}
                          </span>
                        </td>
                        <td className="px-8 py-8 text-right">
                          <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setEditModalData({ id: user._id, query: user.query || "", leadStatus: user.leadStatus || "pending" })} className="p-3 rounded-[1rem] bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 transition-all border border-white/5"><Edit2 size={18} /></button>
                            <button onClick={() => handleDelete(user._id)} className="p-3 rounded-[1rem] bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition-all border border-white/5"><Trash2 size={18} /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={5} className="text-center py-28 text-gray-600 font-light italic text-base">No Principal inquiries found.</td></tr>
                  )}
                </tbody>
              </table>
           </div>

           <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-8">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">{showingDetails}</span>
              <div className="flex gap-3">
                <button disabled={!pagination.prev} onClick={() => setCurrentPage(p => p - 1)} className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all">Prev</button>
                <div className="w-12 h-12 flex items-center justify-center bg-orange-500 text-white font-black rounded-xl shadow-xl">{pagination.currentPage || 1}</div>
                <button disabled={!pagination.next} onClick={() => setCurrentPage(p => p + 1)} className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl disabled:opacity-20 hover:bg-white/10 transition-all">Next</button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}