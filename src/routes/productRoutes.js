const express = require("express")
const { param } = require("express-validator")
const ProductController = require("../controllers/productController")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")
const { productCreationValidation } = require("../middleware/validationMiddleware")

const router = express.Router()

router.post("/", authMiddleware, adminMiddleware, productCreationValidation, ProductController.createProduct)
router.get("/", ProductController.getAllProducts)
router.get("/:id", param('id').isUUID().withMessage("Invalid product ID"), ProductController.getProductById)
router.put("/:id", authMiddleware, adminMiddleware, productCreationValidation, ProductController.updateProduct)
router.delete("/:id", authMiddleware, adminMiddleware, param('id').isUUID().withMessage("Invalid product ID"), ProductController.deleteProduct)

module.exports = router