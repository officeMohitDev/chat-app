import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import envConfig from '../config/envConfig.js';
import User from './userModal.js';
import createHttpError from '../utils/httpError.js';
import Notification from '../notification/notificationModal.js';

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

        const invitedUser = await User.findById(userId);
        if (!invitedUser) {
            // return res.status(404).json({message: "Couldnt find the user"})
            const error = createHttpError(404, "No user")
            next(error)
        }

        const notification = await Notification.create({
            type: "friendRequest",
            user: userId,
            sender: invitingUserId,
            message: `Invited you to chat`,
            status: "unread"
        })

        invitedUser.notifications.push(notification._id)

        await invitedUser.save();

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

}