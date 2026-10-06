const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if token exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Expected format:
        // Authorization: Bearer YOUR_TOKEN
        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Access denied. Invalid token format."
            });
        }

        // Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Store user information in request
        req.user = decoded;

        // Continue to protected route
        next();

    } catch (error) {
        console.error("JWT verification error:", error.message);

        return res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateToken;