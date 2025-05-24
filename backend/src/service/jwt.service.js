const jwt = require('jsonwebtoken');
require('dotenv').config();

// Token cache to store active tokens
const tokenCache = new Map();

const generateToken = (userId, email, phone = null, role = 'customer') => {
    try {
        const payload = {
            userId: userId,
            email: email,
            phone: phone,
            role: role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            algorithm: 'HS256'
        });

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return {
            success: true,
            data: decoded
        };
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

const refreshToken = (oldToken) => {
    try {
        const decoded = jwt.verify(oldToken, process.env.JWT_SECRET, { ignoreExpiration: true });
        
        // Check if token is within refresh window (e.g., 7 days from expiration)
        const now = Math.floor(Date.now() / 1000);
        const refreshWindow = 7 * 24 * 60 * 60; // 7 days in seconds
        
        if (now - decoded.exp > refreshWindow) {
            throw new Error('Token too old to refresh');
        }

        // Generate new token with same payload but new expiration
        return generateToken(decoded.userId, decoded.email, decoded.phone, decoded.role);
    } catch (error) {
        console.error('Token refresh failed:', error.message);
        throw new Error('Token refresh failed');
    }
};

const blacklistToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const blacklistKey = `blacklist_${decoded.userId}_${decoded.iat}`;
        
        // Store in cache with expiration time matching original token
        tokenCache.set(blacklistKey, {
            blacklisted: true,
            expiresAt: decoded.exp * 1000
        });
        
        return true;
    } catch (error) {
        console.error('Error blacklisting token:', error);
        return false;
    }
};

const isTokenBlacklisted = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, { ignoreExpiration: true });
        const blacklistKey = `blacklist_${decoded.userId}_${decoded.iat}`;
        
        const blacklistedToken = tokenCache.get(blacklistKey);
        return blacklistedToken && blacklistedToken.blacklisted === true;
    } catch (error) {
        return false;
    }
};

// Clean up expired tokens from cache
const cleanupExpiredTokens = () => {
    const now = Date.now();
    for (const [key, value] of tokenCache.entries()) {
        if (value.expiresAt && value.expiresAt < now) {
            tokenCache.delete(key);
        }
    }
};

// Run cleanup every hour
setInterval(cleanupExpiredTokens, 60 * 60 * 1000);

module.exports = {
    generateToken,
    verifyToken,
    refreshToken,
    blacklistToken,
    isTokenBlacklisted,
    tokenCache
};