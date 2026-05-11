const Auth = require("../schema/authentication"); // User model ka path sahi check kar lena

const isAdmin = async (req, res, next) => {
    try {
        // req.userId humein 'isAuthenticated' middleware se mil chuka hai
        const user = await Auth.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User nahi mila."
            });
        }

        // 1. Check karna ki role 'admin' hai ya nahi
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access Denied: Yeh area sirf Admins ke liye hai!"
            });
        }

        // 2. Agar admin hai, toh aage badhne do
        next();

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Admin role verify karne mein error aayi.",
            error: error.message
        });
    }
};

module.exports = { isAdmin };