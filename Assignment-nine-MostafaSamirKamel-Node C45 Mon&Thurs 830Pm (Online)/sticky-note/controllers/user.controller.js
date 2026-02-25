const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password, phone, age } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists." });
        }
        const user = new User({ name, email, password, phone, age });
        await user.save();
        res.status(201).json({ message: "User added successfully." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// update user
exports.updateUser = async (req, res) => {
    try {
        const { password, ...updateData } = req.body;

        // Check if updating email and if it exists for another user
        if (updateData.email) {
            const existingUser = await User.findOne({ email: updateData.email, _id: { $ne: req.userId } });
            if (existingUser) {
                return res.status(409).json({ message: "Email already exists." });
            }
        }

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Assign updates
        Object.assign(user, updateData);
        await user.save(); // save to trigger pre-save hooks (for phone encryption)

        res.status(200).json({ message: "User updated." });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// delete user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// get logged in user data
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
