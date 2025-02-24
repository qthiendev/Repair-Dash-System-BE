const { body, param, validateRequest } = require('./validator');

const loginValidation = validateRequest([
    body('identifier_email')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters'),
]);

module.exports = {
    loginValidation,
};
