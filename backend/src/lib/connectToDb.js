import mongoose from "mongoose";
import envConfig from "../config/envConfig.js";

export default async function ConnectToDB() {
    try {
        await mongoose.connect(envConfig.mongoUrl).then(() => {
            console.log("Connected to db")
        })
    } catch (error) {
        console.log(error)

    }
}
