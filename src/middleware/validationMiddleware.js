const { body, validationResult } = require('express-validator')

const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        return res.status(400).json({
            errors: errors.array()
        })
    }
}


// Registration validation
exports.validateRegistration = validate([
    body('username')
        .trim()
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must contain only letters and numbers'),

    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/\d/).withMessage('Password must contain a number')
]);

// Login validation
exports.validateLogin = validate([
    body('email')
        .trim()
        .isEmail().withMessage('Invalid email address'),

    body('password')
        .not().isEmpty().withMessage('Password is required')
]);

exports.productCreationValidation = validate([
    body('name')
        .trim()
        .isLength({ min: 2, max: 22 })
        .withMessage("Product name must be between 2 and 255 characters"),

    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required."),

    body("stock")
        .isInt({ min: 0 })
        .withMessage("Stock must be a non-negative integer")
])

exports.adminCreationValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid email address'),

    body('password')
        .isLength({ min: 12 })
        .withMessage('Password must be at least 12 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/)
        .withMessage('Password must include uppercase, lowercase, number, and special character')
];