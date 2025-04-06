const { query, param } = require('express-validator');

const readServiceReportValidation = [
    param('service_id')
        .optional()
        .isInt({ min: 1 }).withMessage('Service ID must be a positive integer'),
    query('index')
        .optional()
        .isInt({ min: 1 }).withMessage('Index must be a positive integer')
        .toInt(),
    query('max_range')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Max range must be between 1 and 100')
        .toInt(),
];

module.exports = {
    readServiceReportValidation,
};
