const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const passport = require('passport');
const cors = require("cors");
const session = require('express-session');
const cookieParser = require("cookie-parser");
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');
const { DBConnection } = require("./database/db.js");
require('dotenv').config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cookieParser());

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Connect to MongoDB
DBConnection();

// Routes
app.get('/', (req, res) => {
    res.send("Welcome to my application!");
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});