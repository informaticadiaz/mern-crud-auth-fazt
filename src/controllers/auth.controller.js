import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SCRET } from "../config.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body

        const userFound = await User.findOne({ email })

        if (userFound)
            return res.status(400).json({
                message: ['the email is already in use'],
            })

        // hashing the password
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            username,
            email,
            password: passwordHash,
        })

        // saving the user in the database
        const userSaved = await newUser.save()

        // create acces token
        const token = await createAccessToken({
            id: userSaved._id,
        })

        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none",
        })

        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const userFound = await User.findOne({ email })

        if (!userFound)
            return res.status(400).json({
                message: ["The email does exist"],
            })

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) {
            return res.status(400).json({
                message: ["The password is incorrect"],
            })
        }

        const token = await createAccessToken({
            id: userFound._id,
            usename: userFound.username,
        })

        res.cookie('token', token, {
            httpOnly: process.env.NODE_ENV !== "development",
            secure: true,
            sameSite: "none",
        })

        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: 'Unauthorized' })

    jwt.verify(token, TOKEN_SCRET, async (err, user) => {
        if (err) return res.status(401).json({ message: 'Unauthorized' })

        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({ message: 'Unauthorized' })

        return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
        })
    })
}

export const logout = (req, res) => {
    res.cookie('token', '', {
        expires: new Date(0),
    })
    return res.sendStatus(200)
}

export const profile = async (req, res) => {
    const userFound = await User.findById(req.user.id)

    if (!userFound) return res.status(400).json({ error: "User not found" })

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt,
    })
    res.send('profile')
}

