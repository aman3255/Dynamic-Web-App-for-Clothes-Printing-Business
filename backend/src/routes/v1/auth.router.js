const express = require('express');
const { SignupController, SigninController } = require('./../../controllers/auth.controller');
const { userLoginOrNot } = require('./../../middleware/user.middleware')

const authRouter = express.Router();

authRouter.post('/signup',SignupController);
authRouter.post('/signin',userLoginOrNot, SigninController);

module.exports = authRouter;