const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('../config/passport');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Google authentication route
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.json(req.user);
});

module.exports = router;
