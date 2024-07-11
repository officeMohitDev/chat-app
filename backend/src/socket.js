import express from 'express'
import http from 'http'
import { Server } from 'socket.io'


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});


io.on("connection", (socket) => {
    console.log("socket id", socket.id)
    socket.on("disconnect", () => {
        console.log("disconnect")
    })

})

export { io, app, server }