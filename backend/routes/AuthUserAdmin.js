const express = require("express");
const router = express.Router();
const { 
    getAllUsers, 
    updateUser, 
    deleteUser 
} = require("../AdminDashBoard/getAllUser"); // Path apne folder structure ke hisab se check karein

// 👇 Bas yeh do middlewares import karne hain (Path check kar lena)
const isAuthenticated = require("../middleware/authMiddleware"); 
const { isAdmin } = require("../middleware/isAdmin"); 


// 1. Get All Users (Search, Filter, Stats, Pagination sab isme hai)
// 👇 Yahan routes ke beech mein guards laga diye
router.get("/" , isAuthenticated, isAdmin, getAllUsers);

// 2. Update Only Status & LeadStatus
router.put("/:id" , isAuthenticated, isAdmin, updateUser);

// 3. Delete User
router.delete("/:id" , isAuthenticated, isAdmin, deleteUser);

module.exports = router;