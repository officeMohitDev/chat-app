import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    invitations: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    invited: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    groups: [{ type: mongoose.Schema.Types.ObjectId, ref: "Group" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId, ref: "Notification"
    }]
}, {
    timestamps: true
})

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User