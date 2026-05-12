import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // LocalStorage se user ki info nikalna
    const user = JSON.parse(localStorage.getItem("user"));

    // Check: User logged in hona chahiye aur uska role 'admin' hona chahiye
    if (!user || user.role !== "admin") {
        return <Navigate to="/signin" replace />;
    }

    // Agar sab sahi hai, toh Admin components dikhao
    return children;
};

export default ProtectedRoute;
