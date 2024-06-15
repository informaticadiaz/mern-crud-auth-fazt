import jwt from "jsonwebtoken"
import { TOKEN_SCRET } from "../config.js"

export const authRequired = (req, res, next) => {
    const { token } = req.cookies
    
    if (!token) return res.status(401).json({ error: 'No token, authorization denied' })

    jwt.verify(token, TOKEN_SCRET, (err, user) => {
        if (err) return res.status(401).json({ error: 'Invalid token' })
        
        req.user = user

        next()
    })
}