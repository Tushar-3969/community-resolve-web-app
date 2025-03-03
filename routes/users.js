const express = require('express');
const User = require('../models/user');

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = new User({ username, email, password }); // No hashing
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

// User Profile
router.get('/profile', async (req, res) => {
    const userId = req.userId; // Ensure you're handling authentication

    try {
        const user = await User.findById(userId).select('username password email'); // Return password as well
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ username: user.username, password: user.password, email: user.email });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare with the plain text password directly
        if (user.password === password) { // Direct comparison
            res.json({ message: 'Login successful', userId: user._id }); // Send user ID
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
// Admin login
router.post('/admin/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || user.role !== 'admin') {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.password === password) {
            res.json({ message: 'Login successful', userId: user._id });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});



// Change Password
router.post('/change-password', async (req, res) => {
    const { userId, newPassword } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.password = newPassword; // Store new password as is
        await user.save();
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

module.exports = router;