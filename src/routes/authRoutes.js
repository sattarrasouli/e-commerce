const express = require("express")
const router = express.Router()
const { register, login, createAdminUser } = require("../controllers/authController")
const { validateLogin, validateRegistration, adminCreationValidation } = require("../middleware/validationMiddleware")

router.post("/register", validateRegistration, register)
router.post("/login", validateLogin, login)
router.post(
    '/create-admin',
    adminCreationValidation,
    createAdminUser
);

module.exports = router;