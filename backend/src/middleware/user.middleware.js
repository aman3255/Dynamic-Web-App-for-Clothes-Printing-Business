const { verifyToken } = require('./../service/jwt.service');

/**
 * Middleware to check if user is authenticated via JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const userLoginOrNot = async (req, res, next) => {
    try {
        // Get authorization header
        const authHeader = req.headers['authorization'];
        
        // Check if header exists and has correct format
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authorization header missing or malformed (use Bearer <token>)'
            });
        }

        // Extract token from header
        const token = authHeader.split(' ')[1];

        // Verify token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token missing after Bearer'
            });
        }

        // Verify the token and set user in request
        // The verifyToken function already handles JWT verification errors
        const decoded = verifyToken(token);
        req.user = decoded;

        // Continue to the next middleware or route handler
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        
        // Return appropriate status code from error or default to 401
        return res.status(error.statusCode || 401).json({
            success: false,
            message: `Authentication failed: ${error.message}`
        });
    }
};

module.exports = {
    userLoginOrNot
};