// userAuth.js (your middleware file)

import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
    const { token } = req.cookies; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Not authenticated. Please login again." });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: tokenDecode.id };
        next(); 

    } catch (error) {
        console.error("Authentication Middleware Error:", error); // Log the actual error
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired. Please login again." });
        }
        // Handle other JWT errors (e.g., JsonWebTokenError for malformed token)
        return res.status(401).json({ success: false, message: "Not authorized. Invalid token." });
    }
};

export default userAuth;
