import express from 'express';
import { isAuthenticated, login, logout, register, resetPassword, sendResetOtp, sendVerifyOtp, verifyEmail } from '../controllers/authcontoller.js';
import userAuth from '../middleware/userAuth.js';

const authRouter=express.Router();

authRouter.post('/register', register)
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/sendOtp',sendVerifyOtp);
authRouter.post('/verify-account',verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/resetPassword',resetPassword);

export default authRouter
