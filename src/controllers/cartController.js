const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { Op } = require('sequelize');

class CartController {
    async addToCart(req, res) {
        try {
            const { productId, quantity } = req.body;
            const { id: userId } = req.user;

            // Validate inputs
            const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
            if (!uuidRegex.test(userId) || !uuidRegex.test(productId)) {
                return res.status(400).json({ message: 'Invalid User ID or Product ID format' });
            }

            if (!quantity || quantity <= 0) {
                return res.status(400).json({ message: 'Quantity must be greater than 0' });
            }

            // Fetch product and validate stock
            const product = await Product.findByPk(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const cartItem = await Cart.findOne({
                where: {
                    userId,
                    productId,
                },
            });

            const totalRequestedQuantity = (cartItem ? cartItem.quantity : 0) + quantity;

            if (totalRequestedQuantity > product.stock) {
                return res.status(400).json({
                    message: `Requested quantity exceeds available stock. Only ${product.stock - (cartItem ? cartItem.quantity : 0)} more items are available.`,
                });
            }

            // Update or create cart item
            if (cartItem) {
                cartItem.quantity += quantity;
                await cartItem.save();
            } else {
                await Cart.create({
                    userId,
                    productId,
                    quantity,
                });
            }

            res.status(200).json({ message: 'Product added to cart' });
        } catch (error) {
            res.status(500).json({ message: 'Error adding product to cart', error: error.message });
        }
    }


    async getCart(req, res) {
        try {
            const { id: userId } = req.user;

            const cartItems = await Cart.findAll({
                where: { userId },
                include: [
                    {
                        model: Product,
                        as: 'product',
                    },
                ],
            });

            if (!cartItems.length) {
                return res.status(404).json({ message: 'No items found in cart' });
            }

            res.status(200).json({ cart: cartItems });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving cart', error: error.message });
        }
    }

    async removeFromCart(req, res) {
        try {
            const { productId } = req.params;
            const { id } = req.user;

            const cartItem = await Cart.findOne({
                where: {
                    id,
                    productId
                }
            });

            if (!cartItem) {
                return res.status(404).json({ message: 'Product not found in cart' });
            }

            await cartItem.destroy();
            res.status(200).json({ message: 'Product removed from cart' });
        } catch (error) {
            res.status(500).json({ message: 'Error removing product from cart', error: error.message });
        }
    }
}

module.exports = new CartController();
