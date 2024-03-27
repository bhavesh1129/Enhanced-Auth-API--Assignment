// Authentication routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // Authentication controller
const passport = require('../config/passport'); // Passport configuration

// Define authentication routes
router.post('/register', authController.register); // User registration
router.post('/login', authController.login); // User login
router.get('/logout', authController.logout); // User logout

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google authentication callback route
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    res.json(req.user); // Return authenticated user details
});

module.exports = router;
