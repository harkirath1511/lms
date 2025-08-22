import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        // ⭐⭐⭐ FIX 1: Get userId from req.user (from auth middleware) ⭐⭐⭐
        // 'req.user' is typically populated by your authentication middleware (e.g., from verifying a JWT)
        // Make sure your authentication middleware sets the user ID as req.user.id or req.user._id
        const userId = req.user?.id || req.user?._id; // Use optional chaining for safety

        if (!userId) {
            // This means the user is not authenticated or the middleware didn't attach the ID
            return res.status(401).json({ success: false, message: "User not authenticated or ID missing." });
        }

        const user = await userModel.findById(userId).select('-password'); // .select('-password') is good practice

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        res.json({
            success: true,
            userData: {
                // ⭐⭐⭐ FIX 2: Include user._id in the response ⭐⭐⭐
                id: user._id, // Add the user's MongoDB _id here
                name: user.name,
                email: user.email, // It's often useful to send email too
                isAccountVerified: user.isAccountVerified,
                // Add any other properties from the user model you need on the frontend
            },
            message: "User data fetched successfully." // A helpful message
        });
    } catch (error) { // Make sure to catch the 'error' object
        console.error("Error fetching user data:", error); // Log the actual error for debugging
        res.status(500).json({ success: false, message: error.message || "Server error fetching user data." });
    }
};