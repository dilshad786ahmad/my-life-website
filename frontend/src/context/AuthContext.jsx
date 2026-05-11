import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Navigation ke liye
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  });

  const navigate = useNavigate(); // Hook initialize kiya

  // --- LOGOUT FUNCTION WITH REDIRECT ---
  const logout = async () => {
    try {
      // 1. Backend call with credentials for cookies
      await axios.post("http://localhost:5000/api/auth/logout", {}, { 
        withCredentials: true 
      });
      
      toast.success("Logged out successfully! 👋");
    } catch (err) {
      console.error("Logout Error:", err);
      // Backend fail ho tab bhi local session clear karna zaruri hai
      toast.error("Session cleared locally.");
    } finally {
      // 2. Client side cleanup (Always runs)
      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token"); // Agar token alag se rakha hai toh

      // 3. HOME PAGE PE NAVIGATE KAREIN
      navigate("/"); 
    }
  };

  // --- LOGIN FUNCTION ---
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    // Login ke baad dashboard pe bhejna hai toh yahan bhi navigate use kar sakte hain
    // navigate("/admin/dashboard"); 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);