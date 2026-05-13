import { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Header";
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from "./Admin/ProtectedRoute";
import AdminHeader from "./components/AdminHeader";

// ─── Lazy-loaded Public Pages ───────────────────────────────────────────────
const Container       = lazy(() => import("./pages/Container"));
const About           = lazy(() => import("./pages/About"));
const WhatIOffer      = lazy(() => import("./pages/Offer"));
const SpecializedSolutions = lazy(() => import("./pages/Contact"));
const SkillsSection   = lazy(() => import("./pages/Skills"));
const Projects        = lazy(() => import("./pages/Project"));
const ProjectDetails  = lazy(() => import("./components/Project_details"));
const PricingPage     = lazy(() => import("./pages/Pricing"));
const SignUp          = lazy(() => import("./pages/SignUp"));
const SignIn          = lazy(() => import("./pages/SignIn"));
const ForgotPassword  = lazy(() => import("./pages/ForgotPassword"));
const Footer          = lazy(() => import("./components/Footer"));
const DynamicPage     = lazy(() => import("./pages/DynamicPage"));
const Team            = lazy(() => import("./pages/our_team"));
const TeamDetails     = lazy(() => import("./pages/TeamDetails"));
const ServiceDetails  = lazy(() => import("./pages/ServiceDetails"));
const ClientFeedback  = lazy(() => import("./pages/ClientFeedback"));
const NotFound        = lazy(() => import("./pages/NotFound"));

// ─── Lazy-loaded Admin Pages ─────────────────────────────────────────────────
const AdminHome           = lazy(() => import("./Admin/AdminHome"));
const AdminAbout          = lazy(() => import("./Admin/AdminAbout"));
const AdminServices       = lazy(() => import("./Admin/AdminServices"));
const AdminSkills         = lazy(() => import("./Admin/AdminSkills"));
const AdminProjects       = lazy(() => import("./Admin/AdminProjects"));
const AdminPrices         = lazy(() => import("./Admin/AdminPrices"));
const AdminContact        = lazy(() => import("./Admin/AdminContact"));
const AdminDashboard      = lazy(() => import("./Admin/AdminDashBord"));
const AdminProjectDetails = lazy(() => import("./Admin/AdminProjectDetails"));
const AdminTeam           = lazy(() => import("./Admin/AdminTeam"));
const AdminServiceDetails = lazy(() => import("./Admin/AdminServiceDetails"));
const AdminFeedback       = lazy(() => import("./Admin/AdminFeedback"));

// ─── Minimal page-transition fallback (invisible to user) ────────────────────
const PageFallback = () => (
  <div className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[9999] pointer-events-none">
    <div className="w-8 h-8 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
  </div>
);

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isAuthRoute = location.pathname === "/signin" || location.pathname === "/signup" || location.pathname === "/forgot-password";

  return (
    <>
      <Toaster 
        position="top-center" 
        reverseOrder={false} 
        toastOptions={{
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
            borderRadius: '16px',
            padding: '16px',
            border: 'var(--toast-border)'
          }
        }}
      />
      <ScrollToTop />

      {!isAdminRoute && !isAuthRoute && <Navbar />}
      {isAdminRoute && <AdminHeader />}

      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* --- Public Client Routes --- */}
          <Route path="/" element={<Container />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<WhatIOffer />} />
          <Route path="/skills" element={<SkillsSection />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/Prices" element={<PricingPage />} />
          <Route path="/Clients-feedback" element={<ClientFeedback />} />
          <Route path="/contact" element={<SpecializedSolutions />} />
          <Route path="/project_details/:projectId" element={<ProjectDetails />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/page/:slug" element={<DynamicPage />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamDetails />} />
          <Route path="/service_details/:serviceId" element={<ServiceDetails />} />

          {/* --- Protected Admin Dashboard Routes --- */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/my/home" element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
          <Route path="/admin/my/about" element={<ProtectedRoute><AdminAbout /></ProtectedRoute>} />
          <Route path="/admin/my/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/my/skills" element={<ProtectedRoute><AdminSkills /></ProtectedRoute>} />
          <Route path="/admin/my/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
          <Route path="/admin/my/prices" element={<ProtectedRoute><AdminPrices /></ProtectedRoute>} />
          <Route path="/admin/my/contact" element={<ProtectedRoute><AdminContact /></ProtectedRoute>} />
          <Route path="/admin/my/feedback" element={<ProtectedRoute><AdminFeedback /></ProtectedRoute>} />
          <Route path="/admin/my/team" element={<ProtectedRoute><AdminTeam /></ProtectedRoute>} />
          <Route path="/admin/service-details/:serviceId" element={<ProtectedRoute><AdminServiceDetails /></ProtectedRoute>} />
          <Route path="/admin/project-details/:projectId" element={<ProtectedRoute><AdminProjectDetails /></ProtectedRoute>} />

          {/* --- 404 Not Found Catch-all --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      <Suspense fallback={null}>
        {!isAdminRoute && !isAuthRoute && <Footer />}
      </Suspense>
    </>
  );
}

export default App;
