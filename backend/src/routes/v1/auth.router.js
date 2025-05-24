const express = require('express');
const { 
    SignupController, 
    SigninController, 
    GetCurrentUserController,
    checkRole
} = require('./../../controllers/auth.controller');
const { authenticateToken } = require('./../../middleware/user.middleware');

const authRouter = express.Router();

// Public routes
authRouter.post('/signup', SignupController);
authRouter.post('/signin', SigninController);

// Protected routes
authRouter.get('/me', authenticateToken, GetCurrentUserController);

// Role-specific routes (examples)
authRouter.get('/admin/dashboard', authenticateToken, checkRole(['admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to admin dashboard',
        data: {
            user: req.user,
            permissions: ['manage_users', 'manage_products', 'view_analytics']
        }
    });
});

authRouter.get('/vendor/dashboard', authenticateToken, checkRole(['vendor', 'admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to vendor dashboard',
        data: {
            user: req.user,
            permissions: ['manage_own_products', 'view_own_orders', 'manage_inventory']
        }
    });
});

authRouter.get('/customer/profile', authenticateToken, checkRole(['customer', 'admin']), (req, res) => {
    res.json({
        success: true,
        message: 'Customer profile data',
        data: {
            user: req.user,
            permissions: ['place_orders', 'view_own_orders', 'manage_profile']
        }
    });
});

// Logout route (optional - for token blacklisting)
authRouter.post('/logout', authenticateToken, (req, res) => {
    try {
        // You can implement token blacklisting here if needed
        const token = req.headers.authorization?.split(' ')[1];
        // blacklistToken(token); // Uncomment if you implement token blacklisting
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
});

module.exports = authRouter;