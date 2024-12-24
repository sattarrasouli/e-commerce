const express = require("express")
const router = express.Router()
const { register, login } = require("../controllers/authController")

const { validateLogin, validateRegistration } = require("../middleware/validationMiddleware")

router.post("/register", validateRegistration, register)
router.post("/login", validateLogin, login)

module.exports = router;