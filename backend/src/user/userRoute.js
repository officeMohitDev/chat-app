import express from 'express'
import { inviteUserToChat, loginUser, registerUser } from './userController.js';
import validateToken from '../middleware/validateToken.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/invite/:userId", validateToken, inviteUserToChat)

export default userRouter