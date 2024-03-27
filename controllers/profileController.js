// Import the User model and bcrypt library for password hashing
const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Controller function to get the profile of the authenticated user
exports.getMyProfile = async (req, res) => {
    try {
        // Extract the userId from the request object
        const userId = req.user.userId;

        // Find the user by userId in the database
        const user = await User.findById(userId);

        // If user not found, return a 404 error response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the profile visibility is private and the requester is not an admin
        // and the requester is not the owner of the profile, return a 403 error response
        if (user.profile.visibility === 'private' && req.user.role !== 'admin' && user._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Private profile, access denied' });
        }

        // Send the user's profile and email in the response
        res.json({ profile: user.profile, email: user.email });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Controller function to get all public profiles
exports.getAllPublicProfiles = async (req, res) => {
    try {
        // Find all users with public profile visibility
        const users = await User.find({ 'profile.visibility': 'public' }, { '_id': 0, 'profile.name': 1, 'profile.bio': 1, 'profile.photo': 1 });

        // Send the public profiles in the response
        res.json(users);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to get all profiles (admin-only)
exports.getAllProfiles = async (req, res) => {
    try {
        // Check if the requester is an admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Find all users and select specific profile fields
        const users = await User.find({}, { '_id': 0, 'profile.name': 1, 'profile.bio': 1, 'profile.photo': 1 });

        // Send the profiles in the response
        res.json(users);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Controller function to set profile visibility
exports.setProfileVisibility = async (req, res) => {
    try {
        // Find the user by userId
        const user = await User.findById(req.user.userId);

        // If user not found, return a 404 error response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if visibility is provided in the request body
        if (!req.body.visibility) {
            return res.status(404).json({ message: 'User visibility is not set' });
        }

        // Set the profile visibility and save the user
        user.profile.visibility = req.body.visibility;
        await user.save();

        // Send a success message in the response
        res.json({ message: 'Profile visibility updated' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ message: error.message });
    }
};

// Controller function to update profile information
exports.updateProfile = async (req, res) => {
    // Extract updates from the request body
    const updates = Object.keys(req.body);

    // Allowed updates for the profile
    const allowedUpdates = ['name', 'bio', 'phone', 'photo', 'email', 'password'];

    // Check if the updates are valid
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        // Find the user by userId
        const user = await User.findById(req.user.userId);

        // If user not found, return a 404 error response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user's profile fields based on the provided updates
        updates.forEach(update => {
            if (update === 'password') {
                // Hash and update the password
                const hashedPassword = bcrypt.hashSync(req.body[update], 10);
                user.password = hashedPassword;
            } else if (update !== 'email') {
                // Update other profile fields
                user.profile[update] = req.body[update];
            } else {
                // Update the email field
                user[update] = req.body[update];
            }
        });

        // Save the updated user
        await user.save();

        // Send a success message in the response
        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
