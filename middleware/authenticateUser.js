// Import the jsonwebtoken library and load environment variables
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware function to authenticate user using JWT token
const authenticateUser = (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers.authorization;
    // If token is not provided, return a 401 Unauthorized response
    if (!token) return res.status(401).json({ message: 'Authentication required' });

    try {
        // Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        // Set the decoded user information to the request object
        req.user = decoded;
        // Move to the next middleware
        next();
    } catch (error) {
        // If token is invalid, return a 401 Unauthorized response
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Export the authenticateUser middleware
module.exports = authenticateUser;
