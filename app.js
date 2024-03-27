// Import required modules and middleware
const express = require('express');
const helmet = require('helmet'); // Helps secure the Express app by setting various HTTP headers
const rateLimit = require('express-rate-limit'); // Middleware for rate limiting HTTP requests
const passport = require('passport'); // Authentication middleware
const cors = require("cors"); // Middleware to enable Cross-Origin Resource Sharing
const session = require('express-session'); // Middleware for managing sessions
const cookieParser = require("cookie-parser"); // Middleware for parsing cookies
const authRoutes = require('./routes/authRoutes'); // Authentication routes
const profileRoutes = require('./routes/profileRoutes'); // Profile routes
const errorHandler = require('./middleware/errorHandler'); // Error handling middleware
const { DBConnection } = require("./database/db.js"); // Database connection function
require('dotenv').config(); // Load environment variables

// Define the port to run the server on
const PORT = process.env.PORT || 5000;
const app = express(); // Create an Express application

// Configure session middleware
app.use(session({
    secret: process.env.SECRET_KEY, // Secret used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false // Don't create session until something is stored
}));

// Initialize passport and use session middleware
app.use(passport.initialize());
app.use(passport.session());

// Middlewares
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(helmet()); // Add security headers to responses
app.use(cookieParser()); // Parse cookies

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
DBConnection();

// Define routes
app.get('/', (req, res) => {
    res.status(200).send("Welcome to my application!"); // Default route/Health check route
});
app.use('/auth', authRoutes); // Authentication routes
app.use('/profile', profileRoutes); // Profile routes

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
