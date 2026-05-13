// Centralized API configuration
// This URL will be used for all API calls across the frontend.
// The root vercel.json is configured to proxy /api and /uploads to the Render backend.
//  cherck
export const API_BASE_URL = window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://my-life-website-cjdr.vercel.app";
    