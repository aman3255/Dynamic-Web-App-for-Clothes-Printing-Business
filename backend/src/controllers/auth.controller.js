const UserModel = require('./../models/users.model')
require('dotenv').config();
const bcrypt = require('bcrypt');
const { SignupValidation, SigninValidation } = require('./../service/auth.service')
const { generateToken, tokenCache } = require('./../service/jwt.service');

const SignupController = async (req, res) => {
    try {
        console.log('SignupController');
        const { fullName, email, password, addresses, phone, role = 'customer' } = req.body;
        
        // === Validation ===================================================
        SignupValidation(req.body);
        // ==================================================================

        // ====== Check if user exists ====================================
        const existingUser = await UserModel.findOne({ 
            $or: [
                { email: email },
                { phone: phone }
            ]
        });
        
        if (existingUser) {
            return res.status(409).json({ 
                success: false,
                message: 'User already exists with this email or phone number. Please proceed to signin.' 
            });
        }
        // ====================================================

        // ====== Validate role =========================================
        const validRoles = ['customer', 'admin', 'vendor'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }
        // ========================================================

        // ====== Hash Password =========================================
        const hashedPassword = await bcrypt.hash(password, 10);
        // ========================================================

        // ===== Create User =========================================
        const newUser = await UserModel.create({
            fullName,
            email,
            password: hashedPassword,
            addresses: addresses || [],
            phone,
            role
        });
        // ========================================================

        // ============ Calling generateToken ==========================
        const tokenResponse = generateToken(
            newUser._id,
            newUser.email,
            newUser.phone,
            newUser.role
        );
        // =============================================================

        // ============ Sending Response ==========================
        return res.status(201).json({
            success: true,
            message: 'Account successfully created.',
            data: {
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                    role: newUser.role
                },
                accessToken: tokenResponse
            }
        });
        // ========================================================
    } catch (error) {
        console.error(`Error during user registration: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during registration. Please try again later.",
            error: error.message
        });
    }
}

const SigninController = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // === Validation ===================================
        SigninValidation(req.body);

        // === Check if user exists =========================
        const existingUser = await UserModel.findOne({ email: email });
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User does not exist with this email. Please sign up first.'
            });
        }

        // === Check if user is active ======================
        if (!existingUser.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // === Check role match =============================
        if (role && existingUser.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Access denied. You don't have ${role} privileges.`
            });
        }

        // === Check password ===============================
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Incorrect password. Please try again.' 
            });
        }

        // === Token cache check ============================
        const cacheKey = `${email}_${existingUser.role}`;
        const cachedToken = tokenCache.get(cacheKey);
        let token;
        
        if (cachedToken && cachedToken.expiresAt > Date.now()) {
            token = cachedToken.token; // Reuse cached token
        } else {
            token = generateToken(
                existingUser._id, 
                existingUser.email, 
                existingUser.phone,
                existingUser.role
            );
            tokenCache.set(cacheKey, { 
                token, 
                expiresAt: Date.now() + 3600000 // 1 hour
            });
        }

        // === Response =====================================
        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                user: {
                    id: existingUser._id,
                    fullName: existingUser.fullName,
                    email: existingUser.email,
                    role: existingUser.role
                },
                accessToken: token
            }
        });

    } catch (error) {
        console.error(`Error during login: ${error.message}`);
        return res.status(error.statusCode || 500).json({
            success: false,
            message: `An unexpected error occurred during login. Please try again later.`,
            error: error.message
        });
    }
};

// Get current user information based on token
const GetCurrentUserController = async (req, res) => {
    try {
        // The user information is already attached to the request by the authenticateToken middleware
        const userId = req.user.id || req.user.userId;
        
        const user = await UserModel.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'User data retrieved successfully',
            data: {
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                    phone: user.phone,
                    addresses: user.addresses,
                    createdAt: user.createdAt
                }
            }
        });
    } catch (error) {
        console.error(`Error retrieving user data: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'An error occurred while retrieving user data',
            error: error.message
        });
    }
};

// Role-based access control helper
const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient privileges.'
            });
        }
        
        next();
    };
};

module.exports = {
    SignupController,
    SigninController,
    GetCurrentUserController,
    checkRole
};