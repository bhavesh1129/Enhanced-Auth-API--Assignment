// User model
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows nulls and ensures uniqueness
    },
    username: {
        type: String,
        required: true,
        trim: true // Removes whitespace from both ends of the string
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true, // Converts email to lowercase before saving
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'] // Email format validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6 // Minimum password length
    },
    profile: {
        name: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    // Phone number validation logic
                    return /^\d{10}$/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        photo: String,
        visibility: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

// Export the User model
module.exports = mongoose.model('User', userSchema); 
