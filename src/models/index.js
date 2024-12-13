const sequelize = require("../config/database")
const Product = require('./product')
const Category = require("./category")

Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hanMany(Product, { foreignKey: "categoryId" })


const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log("All tables created or already exist")
    } catch (err) {
        console.log(`Error: ${err}`)
    }
}

module.exports = {
    Product,
    Category,
    syncDatabase
}