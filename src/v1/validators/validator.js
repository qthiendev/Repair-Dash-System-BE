const { query, body, param, validationResult } = require('express-validator');

const validateRequest = (rules) => [
    rules,
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = { query, body, param, validateRequest };
