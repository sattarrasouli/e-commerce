const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")
const hooks = require("../hooks/userHooks")
const methods = require("../methods/userMethods")

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
    {
        hooks
    }
)

User.prototype.validatePassword = methods.validatePassword;

module.exports = User;