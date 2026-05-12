import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    // LocalStorage se user data uthao (Jo humne signin ke waqt save kiya tha)
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    // Agar token nahi hai ya role admin nahi hai, toh bhaga do (Sign In par)
    if (!token || user?.role !== "admin") {
        return <Navigate to="/signin" replace />;
    }

    // Agar sab sahi hai, toh component dikhao
    return children;
};

export default ProtectedRoute;
