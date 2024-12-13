const User = require("../models/User")
const jwt = require("jsonwebtoken")
const { Op } = require('sequelize');

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
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid login credentials"
            });
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid login credentials"
            });
        }

        // Include the user's role in the JWT payload
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.json({
            "user-credentials": {
                id: user.id,
                username: user.username,
                role: user.role,
                token: token
            },
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const createAdminUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if admin user already exists
        const existingAdmin = await User.findOne({
            where: {
                [Op.or]: [
                    { email },
                    { username }
                ],
                role: 'admin'
            }
        });

        if (existingAdmin) {
            return res.status(400).json({
                message: 'Admin user with this email or username already exists'
            });
        }

        // Create new admin user
        const newAdminUser = await User.create({
            username,
            email,
            password,
            role: 'admin'
        });

        // Remove sensitive information
        const adminResponse = newAdminUser.toJSON();
        delete adminResponse.password;

        res.status(201).json({
            message: 'Admin user created successfully',
            user: adminResponse
        });
    } catch (error) {
        console.error('Admin user creation error:', error);
        res.status(500).json({
            message: 'Error creating admin user',
            error: error.message
        });
    }
};

module.exports = {
    register, login, createAdminUser
}

