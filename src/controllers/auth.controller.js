import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
    const { username, email, password } = req.body

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        })

        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id, })
        
        res.cookie('token', token)
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        })
    } catch (error) {
        console.log(error)
    }
}

export const login = (req, res) => res.send("Login");