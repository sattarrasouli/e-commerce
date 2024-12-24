const { DataTypes, Model } = require("sequelize")
const sequelize = require("../config/database")

class Product extends Model { }

Product.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [2, 255] // Minimum 2 characters, maximum 255
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // Allows up to 10 digits with 2 decimal places
        allowNull: false,
        validate: {
            min: 0 // Price cannot be negative
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0 // Stock cannot be negative
        }
    },
    image_url: {
        type: DataTypes.STRING,
        validate: {
            isUrl: true // Ensures a valid URL format
        }
    },
    brand: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
},
    {
        sequelize,
        modelName: "product",
        timestamps: true,
        paranoid: true,
        indexes: [
            { fields: ['category'] },
            { fields: ['brand'] }
        ]
    }
)

module.exports = Product