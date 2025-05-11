const jwt = require('jsonwebtoken');
require('dotenv').config();

// Simple in-memory token cache
const tokenCache = new Map();

/**
 * Generates a JWT token for a user
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @param {string} phone - User phone
 * @returns {string} JWT token
 */
const generateToken = (userId, email, phone) => {
    try {
        const payload = {
            userId,
            email,
            phone
        };
        
        // Get JWT secret from environment variables or use a default (for development only)
        const jwtSecret = process.env.DEV_JWT_SECRET_KEY || 'your-default-secret-key';
        
        // Set token expiration (1 hour)
        const options = {
            expiresIn: '1h'
        };
        
        // Generate and return token
        const token = jwt.sign(payload, jwtSecret, options);
        return token;
    } catch (error) {
        console.error(`Error generating token: ${error.message}`);
        throw new Error('Failed to generate authentication token');
    }
};

/**
 * Verifies a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
    try {
        const jwtSecret = process.env.DEV_JWT_SECRET_KEY || 'your-default-secret-key';
        const decoded = jwt.verify(token, jwtSecret);
        return decoded;
    } catch (error) {
        console.error(`Token verification error: ${error.message}`);
        throw new Error('Invalid or expired token');
    }
};

module.exports = {
    generateToken,
    verifyToken,
    tokenCache
};