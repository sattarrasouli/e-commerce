const express = require("express")
const dotenv = require("dotenv")
const sequelize = require('./src/config/database');

dotenv.config()

const app = express()

const jwtSecret = process.env.JWT_SECRET
if (!jwtSecret) {
    console.error("JWT_SECRET is not defined")
    process.exit(1)
}

app.use(express.json())

const authRoutes = require("./src/routes/authRoutes")
const productRoutes = require("./src/routes/productRoutes")

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke')
})

const PORT = process.env.PORT || 3000;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = app;