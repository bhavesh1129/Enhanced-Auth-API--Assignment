// Import required libraries and modules
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Import the User model
const jwt = require('jsonwebtoken');
require('dotenv').config(); // Load environment variables

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Google OAuth client ID
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google OAuth client secret
  callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback` // Google OAuth callback URL
},
  // Callback function to handle Google OAuth authentication
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find user with the given Google ID
      let user = await User.findOne({ googleId: profile.id });

      // If user doesn't exist, create a new user
      if (!user) {
        user = new User({
          googleId: profile.id, // Google ID
          username: profile.displayName, // Display name from Google profile
          email: profile.emails[0].value, // Email from Google profile
          profile: {
            name: profile.displayName, // Name from Google profile
            photo: profile._json.picture, // Profile photo URL from Google profile
            visibility: 'public' // Set default profile visibility to public
          },
          role: 'user' // Set default role to user
        });

        // Save the new user to the database
        await user.save();
      }

      // Generate JWT token for the user
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' });

      // Pass user and token to the done callback function
      done(null, { user, token });
    } catch (error) {
      // Handle errors
      done(error, false);
    }
  }
));

// Serialize user object to store in the session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user object from the session
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Export configured passport instance
module.exports = passport;
