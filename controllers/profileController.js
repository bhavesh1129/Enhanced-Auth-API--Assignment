const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.profile.visibility === 'private' && req.user.role !== 'admin' && user._id.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Private profile, access denied' });
        }
        res.json({ profile: user.profile, email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllPublicProfiles = async (req, res) => {
    try {
        const users = await User.find({ 'profile.visibility': 'public' }, { '_id': 0, 'profile.name': 1, 'profile.bio': 1, 'profile.photo': 1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAllProfiles = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }
        const users = await User.find({}, { '_id': 0, 'profile.name': 1, 'profile.bio': 1, 'profile.photo': 1 });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.setProfileVisibility = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!req.body.visibility) {
            return res.status(404).json({ message: 'User visibility is not set' });
        }

        user.profile.visibility = req.body.visibility;
        await user.save();
        res.json({ message: 'Profile visibility updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'bio', 'phone', 'photo', 'email', 'password'];

    const isValidOperation = updates.every(update => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        updates.forEach(update => {
            if (update === 'password') {
                const hashedPassword = bcrypt.hashSync(req.body[update], 10);
                user.password = hashedPassword;
            } else if (update !== 'email') {
                user.profile[update] = req.body[update];
            } else {
                user[update] = req.body[update];
            }
        });
        await user.save();

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};