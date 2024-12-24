const sequelize = require("../config/database");
const Product = require("./Product");
const Category = require("./Category");
const Cart = require("./Cart");

// Associations
Product.belongsTo(Category, { foreignKey: "categoryId" });
Category.hasMany(Product, { foreignKey: "categoryId" });

Product.hasMany(Cart, { foreignKey: "productId", as: "cartItems" });
Cart.belongsTo(Product, { foreignKey: "productId", as: "product" });

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false, alter: true });
        console.log("All tables created or already exist");
    } catch (err) {
        console.error(`Error syncing database: ${err}`);
    }
};

module.exports = {
    sequelize,
    Product,
    Category,
    Cart,
    syncDatabase,
};
