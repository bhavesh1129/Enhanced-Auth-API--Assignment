// Middleware function to authorize admin access
const authorizeAdmin = (req, res, next) => {
    // Check if the user role is not admin, if so, return a 403 Forbidden response
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    // Move to the next middleware
    next();
};

// Export the authorizeAdmin middleware
module.exports = authorizeAdmin;
