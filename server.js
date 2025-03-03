const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const port = process.env.PORT || 3019;

const app = express();

// Middleware
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// MongoDB connection
const uri = 'mongodb://localhost:27017/Complaints';

mongoose.connect(uri)
  .then(() => {
    console.log("MongoDB connection successful");
    createAdminUser(); // Ensure this function is defined
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });


// Import models
const Complaint = require('./models/complaint');
const User = require('./models/user');

// Function to create fixed admin user
async function createAdminUser() {
    const existingAdmin = await User.findOne({ username: 'admin' });
    if (!existingAdmin) {
        const admin = new User({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123', // Store password as is
            role: 'admin'
        });
        await admin.save();
        console.log('Admin user created!');
    } else {
        console.log('Admin user already exists.');
    }
}

// User profile route
app.get('/api/users/profile', async (req, res) => {
    const userId = req.user.id; // Get user ID from the authenticated user
    try {
        const user = await User.findById(userId).select('username email password role');
        res.json({ username: user.username, password: user.password, email: user.email, role: user.role });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});
// User Registration
app.post('/api/users/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = new User({ username, email, password }); // Store password as is
        await user.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

// Change password route
app.post('/api/users/change-password', async (req, res) => {
    const { userId, newPassword } = req.body; // Assume userId is provided in the request
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Update the password directly
        user.password = newPassword; // Store new password as is
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ success: false, message: 'Failed to change password' });
    }
});

// Route for the home page (your landing page is home.html in the public folder)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));  // Serves the home.html file
});

// Serve complaint form
app.get('/complaint', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complaint.html'));
}); 

// Serve admin dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Serve the user page at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

// Serve admin login
app.get('/admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'adminlogin.html'));
});

// Serve leaderboard page
app.get('/leaderboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'leaderboard.html'));
});

// Serve manage complaints page
app.get('/manage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'manage.html'));
});

// Serve user profile page
app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Serve user dashboard
app.get('/user-dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userdashboard.html'));
});

// Serve user login page
app.get('/user-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userlogin.html'));
});

// Serve user registration page
app.get('/user-register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'userregister.html'));
});

// Serve view complaints page
app.get('/view-complaint', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewcomplaint.html'));
});

// Routes
const complaintRoutes = require('./routes/complaints');
app.use('/api/complaints', complaintRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Fetch leaderboard data
app.get('/api/leaderboard', async (req, res) => {
    try {
        const complaints = await Complaint.find();

        const leaderboard = {};
        complaints.forEach(complaint => {
            const department = complaint.department || 'Unknown';
            if (!leaderboard[department]) {
                leaderboard[department] = { resolved: 0, pending: 0 };
            }

            if (complaint.status === 'Resolved') {
                leaderboard[department].resolved += 1;
            } else {
                leaderboard[department].pending += 1;
            }
        });

        const leaderboardArray = Object.keys(leaderboard).map(department => ({
            name: department,
            resolved: leaderboard[department].resolved,
            pending: leaderboard[department].pending
        }));

        res.json(leaderboardArray);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
});

// Serve the main HTML file (optional)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complaint.html'));
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});