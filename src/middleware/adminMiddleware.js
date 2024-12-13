const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach decoded user data to the request object
        req.user = decoded;

        // Check if the user is an admin
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Access denied. Admin rights required." });
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid token." });
    }
};

module.exports = adminMiddleware;
