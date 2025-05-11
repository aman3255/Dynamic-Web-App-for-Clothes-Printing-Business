const UserModel = require('./../models/users.model')
require('dotenv').config();
const bcrypt = require('bcrypt');
const { SignupValidation, SigninValidation } = require('./../service/auth.service')
const { generateToken, tokenCache } = require('./../service/jwt.service');


const SignupController = async (req, res) => {
    try {
        console.log('SignupController');
        const { fullName, email, password, addresses, phone } = req.body;
        // === Validation ===================================================
        SignupValidation(req.body);
        // ==================================================================

        // ====== Check if user exists ====================================
        const existingUser = await UserModel.findOne({ email, phone });
        if (existingUser) {
            return res.status(404).json({ message: 'User already exists with this email and phone number procedd to signin.' });
        }
        // ====================================================

        // ====== Hash Password =========================================
        const hashedPassword = await bcrypt.hash(password, 10);
        // ========================================================
        // console.log('hashedPassword', hashedPassword);

        // ===== Create User =========================================
        const newUser = await UserModel.create({
            fullName,
            email,
            password: hashedPassword,
            addresses,
            phone
        })
        // await newUser.save();
        // ========================================================
        // console.log('newUser', newUser);
        // ============ Calling generateToken ==========================
        const tokenRespone = generateToken(
            newUser._id,
            newUser.email,
            newUser.phone
        );
        // =============================================================
        // console.log('tokenRespone', tokenRespone);

        // ============ Sending Response ==========================

        return res.status(201).json({
            success: true,
            message: 'Account successfully created.',
            data: {
                user: {
                    id: newUser._id,
                    fullName: newUser.fullName,
                    email: newUser.email,
                },
                accessToken: tokenRespone
            }
        });
        // ========================================================
    } catch (error) {
        console.error(`Error during user registration: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred during registration. Please try again later.",
            error: error.message
        })
    }
}

const SigninController = async (req, res) => {
    try {

        const { email, phone, password } = req.body;

        // === Validation ===================================
        SigninValidation(req.body);

        // === Check if user exists =========================
        const existingUser = await UserModel.findOne({ email, phone });
        if (!existingUser) {
            return res.status(404).json({
                message: 'User does not exist with this email & phone number. Please sign up first.'
            });
        }

        // === Check password ===============================
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password. Please try again.' });
        }

        // === Token cache check ============================
        const cachedToken = tokenCache.get(email);
        let token;
        if (cachedToken && cachedToken.expiresAt > Date.now()) {
            token = cachedToken.token; // Reuse cached token
        } else {
            token = generateToken(existingUser._id, existingUser.email, existingUser.phone);
            tokenCache.set(email, { token, expiresAt: Date.now() + 3600000 });
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
                },
                accessToken: token
            }
        });

    } catch (error) {
        return res.status(error.statusCode || 500).json({
            success: false,
            message: `An unexpected error occurred during login. Please try again later: ${error.message}`,
            error: error.message
        });
    }
};

// New controller to get current user information based on token
const GetCurrentUserController = async (req, res) => {
    try {
        // The user information is already attached to the request by the authenticateToken middleware
        const user = req.user;
        
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
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email
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

module.exports = {
    SignupController,
    SigninController,
    GetCurrentUserController
}