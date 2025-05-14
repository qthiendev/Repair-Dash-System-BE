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

const getUserStatisticsValidation = [
    query('index')
        .optional()
        .isInt({ min: 1 }).withMessage('Index must be a positive integer')
        .toInt(),

    query('max_range')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Max range must be between 1 and 100')
        .toInt(),

    query('user_id')
        .optional()
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
        .toInt(),

    query('user_full_name')
        .optional()
        .isString().withMessage('Full name must be a string')
        .trim(),

    query('user_alias')
        .optional()
        .isString().withMessage('Alias must be a string')
        .trim(),

    query('user_phone_number')
        .optional()
        .isString().withMessage('Phone number must be a string')
        .trim(),

    query('role')
        .optional()
        .isIn(['ADMIN', 'STORE', 'CUSTOMER']).withMessage('Role must be one of ADMIN, STORE, CUSTOMER'),

    query('identifier_email')
        .optional()
        .isString().withMessage('Email must be a string')
        .trim()
];

module.exports = {
    readServiceReportValidation,
    getUserStatisticsValidation
};
