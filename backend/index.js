import ConnectToDB from "./src/lib/connectToDb.js";
import { app, server } from "./src/socket.js";
import express from 'express'
import cors from 'cors'
import userRouter from "./src/user/userRoute.js";
import globalErrorHandler from "./src/middleware/globalErrorHandler.js";

app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello Mom!")
})

app.use("/api/user", userRouter)

app.use(globalErrorHandler)

server.listen(5555, () => {
    ConnectToDB()
    console.log("Server is listening on 5555")
})