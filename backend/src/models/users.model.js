const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true, // Allows email to be optional if using phone
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Allows phone to be optional if using email
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        minlength: 6 // Optional for OTP-based phone login
    },
    addresses: [{
        type: String,
        default: []
    }]
}, {
    timestamps: true
});

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;
