import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { User, LogOut, AlertCircle, Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const links = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Skills", path: "/skills" },
    { name: "Projects", path: "/projects" },
    { name: "Prices", path: "/Prices" },
    { name: "Clients-feedback", path: "/Clients-feedback" },
    { name: "Contact", path: "/contact" },

  ];

  if (user?.role === "admin") {
    links.push({ name: "Admin Dashboard", path: "/admin" });
  }

  const confirmLogout = () => {
    logout();
    setShowLogoutModal(false);
    setOpen(false);
  };

  return (
    <div className="fixed top-6 left-0 w-full z-50 px-6">
      <div className={`max-w-7xl mx-auto bg-[#0a0a0a]/60 backdrop-blur-2xl border border-white/10 rounded-3xl px-4 lg:px-4 py-3 lg:py-3 flex items-center justify-between transition-all duration-300 ${isDarkMode ? 'shadow-[0_8px_32px_0_rgba(0,0,0,0.8)]' : 'shadow-none'}`}>

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <span className="text-white font-black text-xl italic">DV</span>
          </div>
          <h1 className="text-white font-bold text-xl tracking-tight hidden sm:block">
            Dev<span className="text-orange-500">Vision</span>
          </h1>
        </NavLink>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex gap-2.5 lg:gap-2.5 xl:gap-4 items-center">
          {links.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `cursor-pointer text-[11px] font-bold tracking-wider uppercase transition-all duration-300 relative py-2 ${isActive ? "text-orange-500" : "text-gray-400 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <span className="relative flex flex-col items-center">
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 w-full h-[2px] bg-orange-500 rounded-full"
                    />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </ul>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-3 xl:gap-6">
          {user ? (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <div className="text-right leading-tight">
                <p className="text-[11px] font-black text-white uppercase tracking-widest">{user.username || user.name}</p>
                <p className="text-[10px] text-gray-500 lowercase">{user.email}</p>
              </div>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-20 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                  {user.avatar ? (
                    <img src={user.avatar || null} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-orange-500 text-sm font-black uppercase">
                      {(user.username || user.email || 'U').charAt(0)}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300 mr-2"
                title="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <NavLink to="/signin">
                <button className="text-gray-400 hover:text-white text-[11px] font-bold uppercase tracking-wider transition">
                  Sign In
                </button>
              </NavLink>
              <NavLink to="/signup">
                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_8px_25px_rgba(249,115,22,0.4)] hover:-translate-y-0.5 active:translate-y-0">
                  Join Now
                </button>
              </NavLink>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="lg:hidden flex items-center gap-4">
          <button
            onClick={() => setOpen(!open)}
            className="w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl text-white relative z-[70] hover:bg-white/10 transition-colors"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- CUSTOM LOGOUT MODAL --- */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowLogoutModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-10 w-full max-w-sm overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-3xl flex items-center justify-center mb-6">
                  <AlertCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight italic">Sign Out?</h3>
                <p className="text-gray-500 mt-4 text-sm leading-relaxed">
                  Kya aap waqai logout karna chahte hain? <br /> Your session will end.
                </p>
                <div className="flex w-full gap-4 mt-10">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="flex-1 py-4 px-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmLogout}
                    className="flex-1 py-4 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-[0_10px_20px_rgba(220,38,38,0.3)] transition-all active:scale-95"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- MOBILE MENU --- */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[55]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-[300px] bg-[#050505] border-l border-white/10 z-[60] flex flex-col p-8 pt-24 shadow-2xl overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {/* Profile Info in Mobile */}
              {user && (
                <div className="mb-12 flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full blur opacity-20"></div>
                    <div className="relative w-20 h-20 rounded-full bg-[#111] border border-white/10 flex items-center justify-center shadow-2xl overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar || null} alt={user.username} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <span className="text-orange-500 text-3xl font-black uppercase">
                          {(user.username || user.email || 'U').charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white tracking-tight">{user.username || user.name}</h3>
                  <p className="text-xs text-gray-500 lowercase">{user.email}</p>
                </div>
              )}

              {/* Links */}
              <ul className="grid grid-cols-2 gap-3 flex-grow content-start">
                {links.map((item, i) => (
                  <NavLink 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setOpen(false)}
                    className={({ isActive }) => `block transition-all duration-300 ${isActive ? 'scale-95' : ''}`}
                  >
                    {({ isActive }) => (
                      <motion.li
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className={`border rounded-2xl p-4 flex flex-col items-center justify-center text-center group transition-all aspect-square sm:aspect-auto sm:h-24 ${
                          isActive 
                            ? "bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]" 
                            : "bg-white/5 border-white/5 hover:bg-orange-500/5 hover:border-orange-500/20"
                        }`}
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-1 transition-colors ${
                          isActive ? "text-orange-500" : "text-gray-500 group-hover:text-orange-500"
                        }`}>
                          {isActive ? "Active" : "Explore"}
                        </span>
                        <span className={`text-sm font-bold transition-colors ${
                          isActive ? "text-white" : "text-gray-200 group-hover:text-white"
                        }`}>
                          {item.name}
                        </span>
                      </motion.li>
                    )}
                  </NavLink>
                ))}
              </ul>

              {/* Mobile Auth/Logout Buttons */}
              <div className="mt-auto pt-8 border-t border-white/10">
                <div className="flex justify-center mb-6">
                  <button
                    onClick={toggleTheme}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-500/10 hover:border-orange-500/20 transition-all duration-300"
                  >
                    {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                  </button>
                </div>
                {user ? (
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-red-500/10 text-red-500 rounded-2xl font-black border border-red-500/20 active:scale-95 transition-all"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <NavLink to="/signin" onClick={() => setOpen(false)}>
                      <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-bold hover:bg-white/10 transition-all">Sign In</button>
                    </NavLink>
                    <NavLink to="/signup" onClick={() => setOpen(false)}>
                      <button className="w-full py-4 bg-orange-500 text-white rounded-2xl text-xs font-black shadow-lg shadow-orange-500/20 active:scale-95 transition-all">Sign Up</button>
                    </NavLink>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
