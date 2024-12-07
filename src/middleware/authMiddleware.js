const jwt = require("jsonwebtoken")
const User = require("../models/user")

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer", '').trim()
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findone({
            _id: decoded.userId
        })

        if (!user) {
            throw new Error()
        }

        req.token = token;
        req.user = user;
        next()
    } catch (error) {
        res.status(401).send({ error: error.message + " Please authenticate" })
    }
}

module.exports = authMiddleware;