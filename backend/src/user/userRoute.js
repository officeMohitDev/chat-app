import express from 'express'
import { acceptUserInvite, declineFriendRequest, inviteUserToChat, loginUser, registerUser, searchUser } from './userController.js';
import validateToken from '../middleware/validateToken.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/invite/:userId", validateToken, inviteUserToChat)
userRouter.post("/accept/:invitingUserId", validateToken, acceptUserInvite)
userRouter.post("/decline/:invitingUserId", validateToken, declineFriendRequest)
userRouter.get("/search", searchUser)

export default userRouter