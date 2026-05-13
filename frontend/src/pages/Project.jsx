import React, { useEffect, useState } from "react";
import { ArrowRight, ExternalLink, Search, ChevronDown, Filter, X } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import Breadcrumb from "../components/Breadcrumb";
import { CardSkeleton } from "../components/Skeleton";
import { API_BASE_URL } from "../apiConfig";

export default function FeaturedProjects() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [category, setCategory] = useState(location.state?.selectedCategory || "All");
  const [sort, setSort] = useState("price-desc");

  const categories = ["All", "AI Integrated Project", "Mini Project", "Medium Project", "Big Project"];

  const fetchData = async () => {
    try {
      if (firstLoad) setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/projectspage?search=${search}&category=${category}&sort=${sort}`);
      setContent(res.data.data);
      setLoading(false);
      setFirstLoad(false);
    } catch (error) {
      console.error("Error fetching projects content:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => fetchData());
      } else {
        fetchData();
      }
    }, 500); // Debounce search

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchData();
  }, [category, sort]);

  const handleViewProject = (id) => {
    if (!user) {
      toast.error("Please sign in to view project details.");
      navigate("/signin", { state: { from: `/project_details/${id}` } });
    } else {
      navigate(`/project_details/${id}`);
    }
  };

  const header = content?.header || {
    badgeText: "Selected Works",
    title: "My Portfolio",
    description: "Explore a curated selection of our most impactful digital products, demonstrating excellence in engineering, design, and strategic execution."
  };

  const projects = content?.projects || [];

  return (
    <div className="bg-[#050505] min-h-screen text-white pt-32 pb-20 px-6 relative overflow-hidden font-sans">
      {/* Background ambient glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] -z-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Breadcrumb />
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tighter">
            {header.title}
          </h1>
          <p className="text-gray-400 text-lg max-w-3xl leading-relaxed font-light">
            {header.description}
          </p>
        </motion.div>

        {/* Mobile Search & Filter Trigger */}
        <div className="lg:hidden flex flex-col gap-6 mb-12">
            {/* Mobile Search Bar */}
            <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search projects..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white outline-none focus:border-orange-500/50 transition-all placeholder-gray-600"
                />
            </div>

            <div className="flex justify-between items-center bg-white/[0.02] border border-white/10 p-5 rounded-[1.5rem] backdrop-blur-xl">
                <div className="flex flex-col gap-1">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500">Category</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div>
                        {category}
                    </span>
                </div>
                <button 
                    onClick={() => setIsFilterOpen(true)}
                    className="bg-orange-500 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/30 flex items-center gap-2 active:scale-95 transition-transform"
                >
                    <Filter className="w-3.5 h-3.5" /> Filters
                </button>
            </div>
        </div>

        {/* Controls: Search, Filter, Sort (Horizontal above cards) */}
        <div className="hidden lg:flex flex-wrap items-center gap-4 mb-12">
          {/* Search Bar */}
          <div className="relative group min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-orange-500 transition-colors" />
              <input 
                  type="text" 
                  placeholder="Search projects..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-orange-500/50 transition-all placeholder-gray-700"
              />
          </div>

          {/* Category Dropdown */}
          <div className="relative group min-w-[200px]">
              <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 transition-all cursor-pointer text-gray-400"
              >
                  {categories.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0d0d0d]">{cat}</option>
                  ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group min-w-[200px]">
              <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl py-4 px-5 pr-12 text-[10px] font-black uppercase tracking-widest outline-none focus:border-orange-500/50 transition-all cursor-pointer text-gray-400"
              >
                  <option value="price-desc" className="bg-[#0d0d0d]">Price: High to Low</option>
                  <option value="price-asc" className="bg-[#0d0d0d]">Price: Low to High</option>
                  <option value="name-asc" className="bg-[#0d0d0d]">Name: A-Z</option>
                  <option value="name-desc" className="bg-[#0d0d0d]">Name: Z-A</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none group-focus-within:rotate-180 transition-transform" />
          </div>
        </div>

        <div className="w-full">
          {/* PROJECTS GRID */}
          <div className="w-full">
            {loading && firstLoad ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="h-[450px]"><CardSkeleton /></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
                {projects.map((project, index) => (
                    <motion.div
                        key={project._id || index}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                        className="group bg-white/[0.03] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex flex-col"
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <img
                                src={project.image || '/placeholder-project.jpg'}
                                loading="lazy"
                                width="400"
                                height="300"
                                alt={project.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60"></div>
                            
                            {/* Price Badge */}
                            {project.price > 0 && (
                                <div className="absolute top-6 right-6 bg-orange-500 text-white px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest shadow-lg flex flex-col items-end">
                                    {project.originalPrice > project.price && (
                                        <span className="text-[8px] line-through opacity-60 mb-0.5">${project.originalPrice}</span>
                                    )}
                                    <span>${project.price}</span>
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <div className="flex gap-2 mb-4 flex-wrap">
                                {project.tags?.slice(0, 3).map((tag, i) => (
                                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-gray-500 px-3 py-1 rounded-lg">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80">{project.category}</span>
                            </div>
                            <h3 className="text-xl md:text-xl lg:text-2xl font-black text-white mb-3 tracking-tight group-hover:text-orange-400 transition-colors">
                                {project.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-8 flex-grow font-light">
                                {project.description?.substring(0, 100)}...
                            </p>
                            
                            <button 
                                onClick={() => handleViewProject(project._id)}
                                className="w-full bg-white/5 border border-white/10 text-white py-3 md:py-3 lg:py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-orange-500 hover:border-orange-500 hover:shadow-[0_10px_25px_rgba(249,115,22,0.4)]"
                            >
                                View Project
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
              <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
                  <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-xs">No projects found matching your criteria</p>
                  <button onClick={() => { setSearch(""); setCategory("All"); }} className="mt-6 text-orange-500 font-black text-[10px] uppercase tracking-widest hover:underline">Clear all filters</button>
              </div>
          )}
          </div>
        </div>

        {/* View All CTA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center"
        >
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 text-gray-500 hover:text-white transition-all font-black text-xs uppercase tracking-[0.3em] group"
          >
            View Full Repository <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>
        </motion.div>
        {/* Mobile Filter Bottom Sheet */}
        <AnimatePresence>
            {isFilterOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsFilterOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] lg:hidden"
                    />
                    {/* Sheet */}
                    <motion.div 
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-[#0d0d0d] border-t border-white/10 rounded-t-[3rem] z-[101] lg:hidden p-8 max-h-[85vh] overflow-y-auto"
                    >
                        <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black italic tracking-tight">Refine <span className="text-orange-500">Results</span></h3>
                            <button onClick={() => setIsFilterOpen(false)} className="p-3 rounded-full bg-white/5 border border-white/10 text-gray-500 hover:text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-10">
                            {/* Mobile Categories */}
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Classification</label>
                                <div className="flex flex-col gap-3">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => { setCategory(cat); setIsFilterOpen(false); }}
                                            className={`text-left px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${
                                                category === cat 
                                                ? "bg-orange-500 border-orange-500 text-white" 
                                                : "bg-white/5 border-white/10 text-gray-500"
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile Sort */}
                            <div className="space-y-4 pb-10">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-1">Sort Strategy</label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { val: "price-desc", label: "Price: High to Low" },
                                        { val: "price-asc", label: "Price: Low to High" },
                                        { val: "name-asc", label: "Name: A-Z" },
                                        { val: "name-desc", label: "Name: Z-A" }
                                    ].map(s => (
                                        <button 
                                            key={s.val}
                                            onClick={() => { setSort(s.val); setIsFilterOpen(false); }}
                                            className={`text-left px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                                sort === s.val ? "bg-white/10 border-orange-500/50 text-white" : "bg-white/5 border-white/10 text-gray-500"
                                            }`}
                                        >
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
