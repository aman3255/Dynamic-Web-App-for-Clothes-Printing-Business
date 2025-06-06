const jwt = require('jsonwebtoken');
const { jwtSecret } = require('dotenv').config().parsed;
const UserModel = require('../models/users.model');

// This middleware verifies the JWT token
const authenticateToken = async (req, res, next) => {
    try {
        // Get auth header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication token is missing'
            });
        }
        
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET || jwtSecret, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false, 
                    message: 'Invalid or expired token'
                });
            }
            
            // Check if user exists
            const user = await UserModel.findById(decoded.userId);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }
            
            // Attach user to request
            req.user = {
                id: user._id,
                email: user.email,
                phone: user.phone,
                fullName: user.fullName,
                role: user.role  // ADD THIS
            };
            
            
            next();
        });
    } catch (error) {
        console.error(`Authentication error: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Authentication error',
            error: error.message
        });
    }
};

module.exports = {
    authenticateToken
};