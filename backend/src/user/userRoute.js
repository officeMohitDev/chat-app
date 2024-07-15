import express from 'express'
import { acceptUserInvite, currentUser, declineFriendRequest, inviteUserToChat, loginUser, registerUser, searchUser } from './userController.js';
import validateToken from '../middleware/validateToken.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/invite/:userId", validateToken, inviteUserToChat)
userRouter.post("/accept/:invitingUserId", validateToken, acceptUserInvite)
userRouter.post("/decline/:invitingUserId", validateToken, declineFriendRequest)
userRouter.get("/search", validateToken, searchUser)
userRouter.get("/me", validateToken, currentUser)

export default userRouter