const { Favorite, User, Service, Order } = require('../../models/index.model');
const { Op, Sequelize } = require('sequelize');

/**
 * Retrieves paginated favorites for a customer with an optional store/service filter.
 * @param {number} customer_id - The ID of the customer.
 * @param {number} index - Page number (starts from 1).
 * @param {number} max_range - Number of items per page.
 * @param {boolean|null} store_only - If true, get only stores; if false, get only services; if null, get all.
 * @returns {Promise<Object>} Paginated list of favorites with average ratings inside service.
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
                attributes: ['user_id', 'user_full_name', 'user_alias', 'user_avatar_url'],
            },
            {
                model: Service,
                as: 'service',
                attributes: ['service_id', 'service_name', 'service_alias', 'service_image_url'],
                include: [
                    {
                        model: User,
                        as: 'owner',
                        required: true,
                        where: { delete_flag: false },
                        attributes: ['user_id', 'user_full_name', 'user_alias', 'user_avatar_url'],
                    },
                ],
            },
        ],
        order: [['created_at', 'DESC']],
        limit: max_range,
        offset: (index - 1) * max_range,
    });

    const favorites = await Promise.all(
        rows.map(async (fav) => {
            let serviceWithRating = fav.service;

            if (fav.service_id && serviceWithRating) {
                const serviceRating = await Order.findOne({
                    where: {
                        service_id: fav.service_id,
                        delete_flag: false,
                    },
                    attributes: [
                        [Sequelize.fn('AVG', Sequelize.col('order_rating')), 'average_rating'],
                    ],
                    raw: true,
                });

                const average_rating = serviceRating && serviceRating.average_rating 
                    ? Number(serviceRating.average_rating) 
                    : null;

                serviceWithRating = {
                    ...serviceWithRating.toJSON(),
                    average_rating: average_rating !== null ? parseFloat(average_rating.toFixed(2)) : null,
                };
            }

            return {
                favorite_id: fav.favorite_id,
                is_store: !!fav.store_id,
                store: fav.store || null,
                service: serviceWithRating || null,
            };
        })
    );

    return {
        current_pages: index,
        total_pages: Math.ceil(count / max_range),
        favorites,
    };
};
