import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import User from './userModal.js';
import createHttpError from '../utils/httpError.js';
import Notification from '../notification/notificationModal.js';
import Group from '../group/groupModal.js';
import { getReceiverSocketId, io } from '../socket.js';

// User registration
export const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            username,
            email,
            password: hashedPassword,
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// User login
export const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email },
            envConfig.secret,
            { expiresIn: '15d' }
        );

        res.status(200).json({
            userId: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


export const inviteUserToChat = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const invitingUserId = req.user.userId

        console.log("user rq", req.user)

        // const invitedUser = await User.findById(userId);
        const [invitingUser, invitedUser] = await Promise.all([
            User.findById(invitingUserId),
            User.findById(userId),
        ])
        if (!invitedUser) {
            // return res.status(404).json({message: "Couldnt find the user"})
            const error = createHttpError(404, "No user")
            next(error)
        }

        let alreadyInvited = invitedUser.invitations.includes(invitingUserId);

        if (alreadyInvited) {
            return res.status(400).json({ message: 'User is already invited' });
        }

        const notification = await Notification.create({
            type: "friendRequest",
            user: userId,
            sender: invitingUserId,
            message: `${invitingUser.username} Invited you to chat`,
            status: "unread"
        })

        let socketId = getReceiverSocketId(userId);

        if (socketId) {
            io.to(socketId).emit("alert", notification)
        }

        invitedUser.notifications.push(notification._id)
        invitedUser.invitations.push(invitingUserId)
        invitingUser.invited.push(invitedUser._id)

        await invitedUser.save();
        await invitingUser.save()

        res.status(201).json({
            message: "User invited sucessfully",
            invitedUser,
            notification
        })

    } catch (error) {
        next(error)
    }
}



export const acceptUserInvite = async (req, res, next) => {
    try {
        const { invitingUserId } = req.params;
        const invitedUserId = req.user.userId;

        if (!invitingUserId || !invitedUserId || (invitingUserId === invitedUserId)) {
            return res.status(400).json({ message: 'Boooo' });
        }

        const [invitingUser, invitedUser] = await Promise.all([
            User.findById(invitingUserId),
            User.findById(invitedUserId),
        ]);

        if (!invitingUser || !invitedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        const alreadyFriend = invitedUser.friends.includes(invitingUserId);

        if (alreadyFriend) {
            return res.status(400).json({ message: 'Already friends' });
        }

        // Create notification
        const notification = await Notification.create({
            type: "message",
            message: `${invitedUser.username} has accepted your friend request`,
            sender: invitedUserId,
            user: invitingUserId,
            status: 'accepted',
        });

        // Create a group for the two friends
        const group = await Group.create({
            name: `${invitingUserId}${invitedUserId}`,
            members: [invitingUserId, invitedUserId]
        });

        // Update friends lists and notifications
        invitingUser.friends.push(invitedUser._id);
        invitedUser.friends.push(invitingUser._id);
        invitedUser.invitations = invitedUser.invitations.filter(id => id.toString() !== invitingUserId);
        invitingUser.notifications.push(notification._id);
        invitingUser.invited = invitingUser.invited.filter(id => id.toString() !== invitedUser._id.toString());

        // Emit socket events
        const invitingUserSocketId = getReceiverSocketId(invitingUserId);
        const invitedUserSocketId = getReceiverSocketId(invitedUserId);

        io.to(invitingUserSocketId).emit("alert", notification);

        if (invitingUserSocketId) {
            io.to(invitingUserSocketId).emit("friend", invitedUser);
        }

        if (invitedUserSocketId) {
            io.to(invitedUserSocketId).emit("friend", invitingUser);
        }

        // Save updates to users
        await Promise.all([
            invitingUser.save(),
            invitedUser.save(),
        ]);

        // Send response
        res.status(200).json({
            notification,
            invitedUser,
            invitingUser
        });
    } catch (error) {
        next(error);
    }
};


export const declineFriendRequest = async (req, res, next) => {
    try {
        const { invitingUserId } = req.params;
        const invitedUserId = req.user.userId;

        if (!invitingUserId || !invitedUserId || (invitingUserId === invitedUserId)) {
            return res.status(400).json({ message: 'Boooo' });
        }

        const [invitingUser, invitedUser] = await Promise.all([
            User.findById(invitingUserId),
            User.findById(invitedUserId),
        ])

        const alreadyFriend = invitedUser.friends.includes(invitingUserId);

        if (alreadyFriend) {
            return res.status(400).json({ message: 'Already friend' });

        }

        invitedUser.invitations.pop(invitingUser._id);
        invitingUser.invited.pop(invitedUser._id);

        res.status(200).json({
            message: "Request Declines!",
            invitedUser,
            invitingUser
        })

    } catch (error) {
        next(error)
    }
}


export const searchUser = async (req, res) => {
    const { username } = req.query;
    const loggedInUserId = req.user.userId
    try {
        // Query the database for users with matching username, excluding the logged-in user
        const users = await User.find({
            _id: { $ne: loggedInUserId }, // Exclude the logged-in user
            username: { $regex: new RegExp(username, 'i') }
        });

        res.json(users);
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}


export const currentUser = async (req, res) => {
    const userId = req.user.userId; // Assuming req.user contains the logged-in user's ID

    try {
        const user = await User.findById(userId)
            .populate('friends invitations invited groups notifications')

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }

}