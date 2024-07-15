import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import envConfig from './config/envConfig.js';


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: [envConfig.frontendUrl],
        methods: ["GET", "POST"]
    }
});

let userMap = {}

export const getReceiverSocketId = (receiverId) => {
    return userMap[receiverId]
}

io.on("connection", (socket) => {
    console.log("socket id", socket.id);
    const userId = socket.handshake.query.userId

    userMap[userId] = socket.id
    if (userId !== "undefined") {
        userMap[userId] = socket.id
    }

    io.emit("onlineUsers", Object.keys(userMap))
    console.log(userMap)
    socket.on("disconnect", () => {
        delete userMap[userId];
        io.emit("getOnlineUsers", Object.keys(userMap))
    })

})

export { io, app, server }