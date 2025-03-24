const { Favorite, User, Service } = require('../../models/index.model');
const { Op } = require('sequelize');

/**
 * Retrieves paginated favorites for a customer with an optional store/service filter.
 * @param {number} customer_id - The ID of the customer.
 * @param {number} index - Page number (starts from 0).
 * @param {number} max_range - Number of items per page.
 * @param {boolean|null} store_only - If true, get only stores; if false, get only services; if null, get all.
 * @returns {Promise<Object>} Paginated list of favorites.
 */
module.exports = async (customer_id, index = 1, max_range = 10, store_only = null) => {
    let whereClause = { customer_id };

    if (store_only === true) whereClause.store_id = { [Op.ne]: null };
    if (store_only === false) whereClause.service_id = { [Op.ne]: null };

    const { count, rows } = await Favorite.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'store',
                attributes: ['user_id', 'user_full_name', 'user_avatar_url'],
            },
            {
                model: Service,
                as: 'service',
                attributes: ['service_id', 'service_name', 'service_image_url'],
            },
        ],
        order: [['created_at', 'DESC']],
        limit: max_range,
        offset: (index - 1) * max_range,
    });

    const favorites = rows.map((fav) => ({
        favorite_id: fav.favorite_id,
        is_store: !!fav.store_id,
        store: fav.store || null,
        service: fav.service || null,
    }));

    return {
        current_pages: index,
        total_pages: Math.ceil(count / max_range),
        favorites,
    };
};
