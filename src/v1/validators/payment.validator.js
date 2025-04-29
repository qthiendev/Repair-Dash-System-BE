const { query, param, validateRequest } = require('./validator');

const createZaloPayValidation = validateRequest([
    query('type')
        .isString()
        .isIn(['MONTHLY', 'YEARLY'])
        .withMessage("Type must be either 'MONTHLY' or 'YEARLY'"),
]);

const checkZaloPayValidation = validateRequest([
    param('trans_id')
        .isString()
        .isLength({ min: 10 })
        .withMessage('Transaction ID must be at least 10 characters'),
]);

module.exports = {
    createZaloPayValidation,
    checkZaloPayValidation,
};
