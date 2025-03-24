const { body, param, validateRequest } = require('./validator');

const addFavoriteValidation = validateRequest([
    body('store_id').optional().isInt().withMessage('Invalid store ID'),
    body('service_id').optional().isInt().withMessage('Invalid service ID'),
]);

const deleteFavoriteValidation = validateRequest([
    param('favorite_id').isInt().withMessage('Invalid favorite ID'),
]);

module.exports = {
    addFavoriteValidation,
    deleteFavoriteValidation
};
