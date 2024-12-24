const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Cart extends Model { }

Cart.init({
    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    }
}, {
    sequelize,
    modelName: 'Cart'
});

module.exports = Cart;
