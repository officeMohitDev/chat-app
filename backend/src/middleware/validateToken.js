import jwt from 'jsonwebtoken'
import envConfig from '../config/envConfig.js';

export default async function validateToken(req, res, next) {
    let authHeader = req.headers.authorization

    if (!authHeader) {
        return res.status(400).json({ message: 'NO authorization header in request' });
    }

    let token = authHeader.split(" ")[1]

    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }

    jwt.verify(token, envConfig.secret, (error, decoded) => {
        if (error) {
            return res.status(400).json({ message: 'Token is expired or invalid' });
        }

        req.user = decoded
        next()
    })

}