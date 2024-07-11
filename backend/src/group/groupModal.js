import mongoose from "mongoose";


const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    about: {
        type: String
    },
    avatar: {
        type: String,
    }
})

const Group = mongoose.model("User", groupSchema);

export default Group