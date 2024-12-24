const express = require("express")
const router = express.Router()
const CartController = require("../controllers/cartController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/", authMiddleware, CartController.addToCart)
router.get("/", authMiddleware, CartController.getCart)
router.delete("/:id", authMiddleware, CartController.removeFromCart)

module.exports = router;