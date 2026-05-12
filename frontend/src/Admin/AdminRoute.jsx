import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
    // 1. LocalStorage se user nikalna
    const user = JSON.parse(localStorage.getItem("user"));

    // 2. Check: Kya user login hai aur kya wo Admin hai?
    if (user && user.role === 'admin') {
        return <Outlet />; // Agar admin hai toh aage badhne do (Next component dikhao)
    }

    // 3. Agar admin nahi hai, toh use Unauthorized page ya Home par bhej do
    return <Navigate to="/signin" replace />;
};

export default AdminRoute;
