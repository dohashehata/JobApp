
import dotenv from 'dotenv';
dotenv.config();

// other imports remain the same
import { Router } from 'express';
import {updateAccount,updatePassword, getUserProfile,getAccountsByRecoveryEmail,forgetPasswordHandler, deleteAccount, getUserData, signIn, signUp } from './users.controller.js';
import auth from '../../middleware/auth.js';
import authorize from '../../middleware/authorize.js';

const userRouter = Router();

// User Routes
userRouter.post('/signup', signUp);
userRouter.post('/signIn', signIn);
userRouter.get('/account/:id', auth(), authorize, getUserData);
userRouter.delete('/delete/:id', auth(), authorize, deleteAccount);
userRouter.get('/profile/:id', auth(), authorize, getUserProfile);
userRouter.patch('/updatePassword', auth(), authorize, updatePassword);
userRouter.patch('/updateAccount/:id', auth(), authorize, updateAccount);
userRouter.post('/forgetPass', forgetPasswordHandler);
userRouter.get('/RecoveryEmail/:recoveryEmail', auth(), authorize, getAccountsByRecoveryEmail);

export default userRouter;