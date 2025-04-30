// ========= JWT utils ======================================
const jwt = require('jsonwebtoken');
require('dotenv').config(); // This should come before accessing process.env
const DEV_JWT_SECRET_KEY = process.env.DEV_JWT_SECRET_KEY;
// ==========================================================

// ====== JWT Token Generation ==========================
const tokenCache = new Map(); // Cache to store tokens (in-memory cache (key-value store)

const generateToken = (userId, email, phone) => {
    try {
        // Check if secret key is available
        if (!DEV_JWT_SECRET_KEY) {
            const err = new Error('JWT secret key not configured');
            err.statusCode = 500;
            throw err;
        }

        const token = jwt.sign({
            userId,
            email,
            phone
        },
            DEV_JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        tokenCache.set(email, {
            token,
            expiresAt: Date.now() + 3600000 // 1 hour in milliseconds
        });
        return token;
    } catch (error) {
        console.error('Error while generating token:', error);
        const err = new Error('Error while generating token');
        err.statusCode = 500; // Fixed: Added statusCode
        throw err;
    }
};

const verifyToken = (token) => {
    try {
        if (!DEV_JWT_SECRET_KEY) {
            const err = new Error('JWT secret key not configured');
            err.statusCode = 500; // Fixed: Added statusCode
            throw err;
        }

        const decoded = jwt.verify(token, DEV_JWT_SECRET_KEY);
        return decoded;
    } catch (error) {
        console.error('Token verification failed:', error);
        const err = new Error('Token verification failed');
        err.statusCode = 401; // Using 401 Unauthorized for token verification failures
        throw err;
    }
};
// ==========================================================

module.exports = {
    generateToken,
    verifyToken,
    tokenCache
};