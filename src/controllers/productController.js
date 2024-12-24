const { Op } = require('sequelize');
const Product = require('../models/Product');
const { validationResult } = require('express-validator');

class ProductController {
    handleError(res, message, error, statusCode = 500) {
        console.error(message, error);
        res.status(statusCode).json({ message, error: process.env.NODE_ENV === 'development' ? error.message : undefined });
    }

    async createProduct(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { name, description, price, category, stock, image_url, brand } = req.body;

            const product = await Product.create({ name, description, price, category, stock, image_url, brand });

            res.status(201).json({ message: 'Product created successfully', product });
        } catch (error) {
            this.handleError(res, 'Error creating product', error);
        }
    }

    async getAllProducts(req, res) {
        try {
            const { page = 1, limit = 10, category, minPrice, maxPrice, search } = req.query;

            const offset = (page - 1) * parseInt(limit);
            const whereClause = {};

            if (category) whereClause.category = category;
            if (minPrice) whereClause.price = { [Op.gte]: parseFloat(minPrice) };
            if (maxPrice) whereClause.price = {
                ...whereClause.price,
                [Op.lte]: parseFloat(maxPrice)
            };
            if (search) {
                whereClause[Op.or] = [
                    { name: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } }
                ];
            }

            const products = await Product.findAndCountAll({
                where: whereClause,
                order: [['createdAt', 'DESC']],
                limit: parseInt(limit),
                offset
            });

            // Return results
            res.json({
                total: products.count,
                totalPages: Math.ceil(products.count / limit),
                currentPage: parseInt(page),
                products: products.rows
            });

        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    }


    // Get a single product by ID
    async getProductById(req, res) {
        try {
            const product = await Product.findByPk(req.params.id);

            if (!product) return res.status(404).json({ message: 'Product not found' });

            res.json(product);
        } catch (error) {
            this.handleError(res, 'Error retrieving product', error);
        }
    }

    // Update a product
    async updateProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            await product.update(req.body);

            res.json({ message: 'Product updated successfully', product });
        } catch (error) {
            this.handleError(res, 'Error updating product', error);
        }
    }

    // Delete a product (soft delete)
    async deleteProduct(req, res) {
        try {
            const { id } = req.params;

            const product = await Product.findByPk(id);
            if (!product) return res.status(404).json({ message: 'Product not found' });

            await product.destroy();

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            this.handleError(res, 'Error deleting product', error);
        }
    }
}

module.exports = new ProductController();
