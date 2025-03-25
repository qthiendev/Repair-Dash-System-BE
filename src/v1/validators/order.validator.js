const { body, param, validateRequest } = require('./validator');

const readCheckoutValidation = validateRequest([
    param('service_id')
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
        .withMessage('Must include service id or alias')
]);

const createOrderValidation = validateRequest([
    body('customer_full_name')
        .isString()
        .isLength({ min: 5, max: 500 })
        .withMessage('Full name must be between 5 and 500 characters'),

    body('customer_phone_number')
        .isString()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),

    body('customer_address')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
]);

const updateOrderValidation = validateRequest([
    param('order_id')
        .isInt({ min: 1 })
        .withMessage('Order ID must be included and greater than 0'),
]);

const deleteOrderValidation = validateRequest([
    param('order_id')
        .isInt({ min: 1 })
        .withMessage('Order ID must be included and greater than 0'),

    body('order_description')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Order description must be at least 5 characters'),

    body('customer_full_name')
        .isString()
        .isLength({ min: 5, max: 500 })
        .withMessage('Full name must be between 5 and 500 characters'),

    body('customer_phone_number')
        .isString()
        .isLength({ min: 10, max: 20 })
        .withMessage('Phone number must be between 10 and 20 characters'),

    body('customer_address')
        .isString()
        .isLength({ min: 5 })
        .withMessage('Address must be at least 5 characters'),
]);

module.exports = {
    readCheckoutValidation,
    createOrderValidation,
    updateOrderValidation,
    deleteOrderValidation
};
