// Profile routes
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController'); // Profile controller
const authenticateUser = require('../middleware/authenticateUser'); // Middleware to authenticate users
const authorizeAdmin = require('../middleware/authorizeAdmin'); // Middleware to authorize admins

// Define profile-related routes
router.get('/me', authenticateUser, profileController.getMyProfile); // Get current user's profile
router.patch('/visibility', authenticateUser, profileController.setProfileVisibility); // Update profile visibility
router.patch('/updateProfile', authenticateUser, profileController.updateProfile); // Update user profile
router.get('/getAllPublicProfiles', authenticateUser, profileController.getAllPublicProfiles); // Get all public profiles
router.get('/getAllProfiles', authenticateUser, authorizeAdmin, profileController.getAllProfiles); // Get all profiles (admin only)

module.exports = router;
