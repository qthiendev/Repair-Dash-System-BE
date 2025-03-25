const { body, param, validateRequest } = require('./validator');

const readUserValidation = validateRequest([
    param('user_id')
        .optional()
        .custom(value => {
            if (typeof value === 'string') {
                if (!value.trim()) {
                    throw new Error('User alias must not be empty');
                }
            } else if (typeof value === 'number') {
                if (!Number.isInteger(value) || value <= 0) {
                    throw new Error('User ID must be a positive integer greater than 0');
                }
            } else {
                throw new Error('Invalid user identifier format');
            }
            return true;
        })
]);

const restPasswordValidation = validateRequest([
    body('password')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters'),
])

const createUserValidation = validateRequest([
    body('identifier_email')
        .isEmail()
        .withMessage('Invalid email format'),

    body('password')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be between 6 and 20 characters'),

    body('role')
        .isString()
        .isIn(['ADMIN', 'STORE', 'CUSTOMER'])
        .withMessage('Role must be either ADMIN, STORE, or CUSTOMER'),

    body('user_full_name')
        .isString()
        .isLength({ min: 5, max: 500 })
        .withMessage('Full name must be between 5 and 500 characters'),

    body('user_alias')
        .isString()
        .isLength({ min: 1, max: 500 })
        .withMessage('Alias must be between 1 and 500 characters'),

    body('user_phone_number')
        .isString()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),

    body('user_street')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_ward')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_district')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_city')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
]);

const updateUserValidation = validateRequest([
    param('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer or greater than 0'),

    body('user_full_name')
        .isString()
        .isLength({ min: 5, max: 500 })
        .withMessage('Full name must be between 5 and 500 characters'),
    
    body('user_alias')
        .isString()
        .isLength({ min: 1, max: 50 })
        .withMessage('Alias must be between 1 and 20 characters'),

    body('user_phone_number')
        .isString()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),

    body('user_street')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_ward')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_district')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),

    body('user_city')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
]);

const deleteUserValidation = validateRequest([
    param('user_id')
        .isInt({ min: 1 })
        .withMessage('User ID must be a positive integer or greater than 0')
]);

module.exports = {
    readUserValidation,
    createUserValidation,
    updateUserValidation,
    deleteUserValidation,
    restPasswordValidation
};
