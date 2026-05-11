const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
    try {
        // 1. Token nikalna (Cookies se ya Authorization header se)
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated. Please login first."
            });
        }

        // 2. Token verify karna
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. User ki ID ko request object mein daal dena taki controllers ise use kar saken
        req.userId = decoded.id;

        // 4. Agle function (Controller) par bhej dena
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token",
            error: error.message
        });
    }
};

module.exports = isAuthenticated;