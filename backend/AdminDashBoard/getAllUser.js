const Auth = require("../schema/authentication");

// @desc    Get All Users with Search, Filter, Date Range, Pagination & Stats
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
    try {
        const { search, status, leadStatus, startDate, endDate, sort } = req.query;
        let query = {};

        // 1. Searching (Username, Email, Mobile, Country, Query)
        if (search) { 
            query.$or = [
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { mobileNumber: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { query: { $regex: search, $options: "i" } }
            ];
        }

        // 2. Filtering
        if (status) query.status = status;
        if (leadStatus) query.leadStatus = leadStatus;

        // 3. Date Range
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(new Date(endDate).setHours(23, 59, 59))
            };
        }

        // --- DASHBOARD STATS CALCULATION ---
        const [totalLeads, totalPending, totalInterested, totalTalkToLater, totalNotInterested] = await Promise.all([
            Auth.countDocuments({}), 
            Auth.countDocuments({ leadStatus: "pending" }),
            Auth.countDocuments({ leadStatus: "interested" }),
            Auth.countDocuments({ leadStatus: "talk to later" }),
            Auth.countDocuments({ leadStatus: "not interested" })
        ]);

        // --- PAGINATION LOGIC ---
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const total = await Auth.countDocuments(query); 

        let result = Auth.find(query).skip(startIndex).limit(limit);
        
        // Sorting: Agar sort nahi hai, toh Last Active user sabse upar dikhega
        if (sort) {
            result = result.sort(sort);
        } else {
            result = result.sort("-lastActive"); 
        }

        const users = await result;
        
        // --- EMPTY STATE HANDLING ---
        if (users.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Koi user data nahi mila.",
                stats: { totalLeads, totalPending, totalInterested, totalTalkToLater, totalNotInterested },
                count: 0,
                data: [],
                pagination: {},
                showingDetails: "Showing 0 entries"
            });
        }
  
        // --- NEXT & PREVIOUS PAGINATION ---
        const pagination = {};
        if (endIndex < total) { pagination.next = { page: page + 1, limit: limit }; }
        if (startIndex > 0) { pagination.prev = { page: page - 1, limit: limit }; }

        pagination.totalPages = Math.ceil(total / limit);
        pagination.currentPage = page;

        // --- SHOWING ENTRIES LOGIC ---
        const showingStart = startIndex + 1;
        const showingEnd = startIndex + users.length;
        const showingDetails = `Showing ${showingStart} to ${showingEnd} of ${total} entries`;

        // Caching rokne ke liye headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        res.status(200).json({
            success: true,
            message: "Users fetched successfully.",
            stats: { totalLeads, totalPending, totalInterested, totalTalkToLater, totalNotInterested },
            count: users.length,
            totalUsers: total,     
            pagination: pagination,
            showingDetails: showingDetails, 
            data: users // Isme activityLog aur lastActive automatic chala jayega
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update User Lead Status & Query
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { query, leadStatus } = req.body; 

        const updatedUser = await Auth.findByIdAndUpdate(
            id,
            { query, leadStatus },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, message: "User updated successfully", data: updatedUser });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete User
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await Auth.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User nahi mila." });
        }

        res.status(200).json({
            success: true,
            message: `User ${user.username} delete kar diya gaya.`
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};