const express = require("express");
const dotenv = require("dotenv");
const { syncDatabase } = require('./src/models');

dotenv.config();

const app = express();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    console.error("JWT_SECRET is not defined");
    process.exit(1);
}

app.use(express.json());

// Import routes
const authRoutes = require("./src/routes/authRoutes");
const productRoutes = require("./src/routes/productRoutes");
const cartRoutes = require('./src/routes/cartRoutes');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke');
});

const PORT = process.env.PORT || 3000;

// Synchronize database and start the server
syncDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(error => {
        console.error('Unable to connect to the database:', error);
    });

module.exports = app;
