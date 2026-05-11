import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Breadcrumb = ({ customTitle }) => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show on Home page
  if (location.pathname === "/" || location.pathname.startsWith("/admin")) {
    return null;
  }

  const formatName = (name) => {
    return name
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="flex items-center gap-2 text-[10px] md:text-sm text-gray-500 mb-10 mt-6 md:mt-0 overflow-x-auto whitespace-nowrap scrollbar-hide no-scrollbar relative z-30">
      <Link to="/" className="hover:text-orange-500 transition-colors font-medium">Home</Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        let to = `/${pathnames.slice(0, index + 1).join("/")}`;
        
        // Handle specific redirects for detail pages to listing pages
        if (value === "service_details") to = "/services";
        if (value === "project_details") to = "/projects";

        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" />
            {last ? (
              <span className="text-orange-500 font-black uppercase tracking-[0.2em]">
                {customTitle || formatName(value)}
              </span>
            ) : (
              <Link to={to} className="hover:text-orange-500 transition-colors font-medium">
                {formatName(value === "service_details" ? "services" : value === "project_details" ? "portfolio" : value)}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
