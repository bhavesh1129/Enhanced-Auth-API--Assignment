// Error handling middleware function
const errorHandler = (err, req, res, next) => {
    // Log the error stack
    console.error(err.stack);
    // Send a 500 Internal Server Error response
    res.status(500).json({ message: 'Internal server error' });
};

// Export the errorHandler middleware
module.exports = errorHandler;
