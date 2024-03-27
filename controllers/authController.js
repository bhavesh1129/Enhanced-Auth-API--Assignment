// Import required modules and middleware
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for generating JSON Web Tokens (JWT)
const User = require('../models/user'); // User model
require('dotenv').config(); // Load environment variables

// Controller for user registration
exports.register = async (req, res) => {
    try {
        // Get username, email, and password from the request body
        const { username, email, password } = req.body;

        // Check if all required data exists
        if (!(username && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // Check if a user already exists with the provided email
        const existingUserWithSameEmail = await User.findOne({ email });
        if (existingUserWithSameEmail) {
            return res.status(200).send("User already exists with the same email!");
        }

        // Check if a user already exists with the provided username
        const existingUserWithSameUsername = await User.findOne({ username });
        if (existingUserWithSameUsername) {
            return res.status(200).send("User already exists with the same username!");
        }

        // Encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d", // Token expires in 1 day
        });

        // Omit the password from the user object
        user.password = undefined;

        // Send a response with the token and user details
        res.status(200).json({ message: "User successfully registered!", user });
    } catch (error) {
        // Handle errors
        res.status(400).json({ message: error.message });
    }
};

// Controller for user login
exports.login = async (req, res) => {
    try {
        // Get email and password from the request body
        const { email, password } = req.body;

        // Check if all required data exists
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // Find the user in the database by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        // Check if the entered password matches the stored password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d", // Token expires in 1 day
        });

        // Omit the password from the user object
        user.password = undefined;

        // Configure options for storing cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Expires in 1 day
            httpOnly: true, // Cookie is only accessible via HTTP(S)
        };

        // Set the token as a cookie in the response
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
        });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Controller for user logout
exports.logout = (req, res, next) => {
    // Clear the JWT token from the client side
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User has been Signed Out!" });
    } catch (error) {
        next(error);
    }
};
