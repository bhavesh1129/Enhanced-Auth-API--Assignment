const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.register = async (req, res) => {
    try {
        //get all the data from body
        const { username, email, password } = req.body;

        // check that all the data should exists
        if (!(username && email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if user already exists (email, username)
        const existingUserWithSameEmail = await User.findOne({ email });
        if (existingUserWithSameEmail) {
            return res.status(200).send("User already exists with same email!");
        }

        const existingUserWithSameUsername = await User.findOne({ username });
        if (existingUserWithSameUsername) {
            return res.status(200).send("User already exists with same username!");
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save the user in DB
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        // generate a token for user and send it
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;
        res
            .status(200)
            .json({ message: "User successfully registered!", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        //get all the user data
        const { email, password } = req.body;

        // check that all the data should exists
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        //find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        //match the password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;

        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulate by server not by client/user
        };

        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.logout = (req, res, next) => {
    // To sign out, simply clear the JWT token from the client side.
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "User has been Signed Out!" });
    } catch (error) {
        next(error);
    }
};