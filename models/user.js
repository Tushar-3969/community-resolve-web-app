const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Removed password hashing middleware
userSchema.pre('save', async function(next) {
    next();
});

// Method to compare passwords (can be used if needed)
userSchema.methods.comparePassword = function(password) {
    return this.password === password; // Simple comparison
};

const User = mongoose.model('User', userSchema);
module.exports = User;
