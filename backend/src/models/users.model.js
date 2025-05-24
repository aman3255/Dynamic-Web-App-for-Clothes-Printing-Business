const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    phone: {
        type: String,
        unique: true,
        sparse: true, // Optional field
        match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number']
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['customer', 'admin', 'vendor'],
        default: 'customer'
    },
    addresses: [{
        type: String,
        default: []
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;