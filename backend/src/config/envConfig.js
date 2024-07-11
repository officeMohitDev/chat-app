import dotenv from 'dotenv'
dotenv.config()
const envConfig = {
    mongoUrl: process.env.MONGO_URL,
    secret: process.env.JWT_SECRET,
}


export default envConfig