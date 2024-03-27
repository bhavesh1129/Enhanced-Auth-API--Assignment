// Import required modules and load environment variables
const mongoose = require('mongoose');
require('dotenv').config();

// Function to establish database connection
const DBConnection = async () => {
    // Get MongoDB URI from environment variables
    const MONGO_URI = process.env.MONGO_URL;
    try {
        // Connect to MongoDB using mongoose
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true });
        console.log('Database connected successfully');
    } catch (error) {
        // Log error if connection fails
        console.log('Error while connecting with the database ', error.message);
    }
}

// Export the database connection function
module.exports = { DBConnection };
