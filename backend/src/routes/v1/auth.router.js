const express = require('express');
const { SignupController, SigninController, GetCurrentUserController } = require('./../../controllers/auth.controller');
const { authenticateToken } = require('./../../middleware/user.middleware')

const authRouter = express.Router();

authRouter.post('/signup', SignupController);
authRouter.post('/signin', SigninController);
authRouter.post('/me', authenticateToken, GetCurrentUserController);

module.exports = authRouter;