const User = require("../models/user")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!email || !password || !username) {
            return res.status(400).json({
                message: "Email, username, and password are required"
            });
        }

        const existingUser = await User.findOne({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exist!"
            });
        }

        const user = new User({
            username,
            email,
            password
        })

        await user.save()

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

        res.status(201).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
            token
        })

    } catch (error) {
        res.status(400).json({ mesasge: error.message })
    }
}


const login = async (req, res) => {
    try {
        const { username, email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email
        })

        if (!user) {
            return res.status(401).json({
                message: "Invalid login credentials"
            })
        }

        const isMatch = await user.comparePassword(password)

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid login credentials"
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)
        res.json({
            user: {
                id: user._id,
                username: user.username
            },
            token
        })

    } catch (error) {
        res.status(400).json({ message: error.mesasge })
    }
}

module.exports = {
    register, login
}