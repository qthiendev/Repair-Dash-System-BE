const { Service, Order, Favorite } = require('../../models/index.model');
const { Sequelize } = require('sequelize');
const terminal = require('../../../utils/terminal');

/**
 * Generates a service report for a store user with pagination.
 * @param {number} user_id - The ID of the store user from the JWT token.
 * @param {number|null} service_id - Optional service ID to filter by.
 * @param {number} index - Page number (default 1).
 * @param {number} max_range - Items per page (default 20).
 * @returns {Promise<Object>} Report with services and totals.
 */
module.exports = async (user_id, service_id = null, index = 1, max_range = 20) => {
    try {
        if (index < 1) index = 1;

        const serviceQuery = {
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*) 
                            FROM orders 
                            WHERE orders.service_id = Service.service_id 
                            AND orders.delete_flag = false
                        )`),
                        'total_orders'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT SUM(CASE WHEN orders.order_status = 'CANCELED' THEN 1 ELSE 0 END)
                            FROM orders 
                            WHERE orders.service_id = Service.service_id 
                            AND orders.delete_flag = false
                        )`),
                        'total_canceled_orders'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT SUM(CASE WHEN orders.order_status = 'COMPLETED' THEN 1 ELSE 0 END)
                            FROM orders 
                            WHERE orders.service_id = Service.service_id 
                            AND orders.delete_flag = false
                        )`),
                        'total_completed_orders'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT SUM(CASE WHEN orders.order_status = 'PENDING' THEN 1 ELSE 0 END)
                            FROM orders 
                            WHERE orders.service_id = Service.service_id 
                            AND orders.delete_flag = false
                        )`),
                        'total_pending_orders'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT SUM(CASE WHEN orders.order_status = 'PROCESSING' THEN 1 ELSE 0 END)
                            FROM orders 
                            WHERE orders.service_id = Service.service_id 
                            AND orders.delete_flag = false
                        )`),
                        'total_processing_orders'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT COUNT(*) 
                            FROM favorites 
                            WHERE favorites.service_id = Service.service_id
                        )`),
                        'total_favorites'
                    ],
                ],
                exclude: ['delete_flag']
            },
            where: {
                delete_flag: false,
                owner_id: user_id,
            },
            include: [
                {
                    model: Order,
                    as: 'orders',
                    attributes: [],
                    where: { delete_flag: false },
                    required: false,
                },
                {
                    model: Favorite,
                    as: 'favorites',
                    attributes: [],
                    required: false,
                },
            ],
        };

        if (service_id) {
            serviceQuery.where.service_id = service_id;
        }

        const services = await Service.findAll(serviceQuery);

        terminal.success(`readServiceReport.service.js | Found ${services.length} services for user ${user_id}, service_id: ${service_id || 'all'}`);

        if (service_id && services.length === 0) {
            return -1;
        }

        const serviceReport = services.map(service => {
            const report = {
                service: {
                    service_id: service.service_id,
                    service_name: service.service_name,
                    service_alias: service.service_alias,
                    service_image_url: service.service_image_url,
                    service_description: service.service_description,
                    owner_id: service.owner_id,
                    created_at: service.created_at,
                    updated_at: service.updated_at,
                },
                total_orders: Number(service.dataValues.total_orders) || 0,
                total_canceled_orders: Number(service.dataValues.total_canceled_orders) || 0,
                total_completed_orders: Number(service.dataValues.total_completed_orders) || 0,
                total_pending_orders: Number(service.dataValues.total_pending_orders) || 0,
                total_processing_orders: Number(service.dataValues.total_processing_orders) || 0,
                total_favorites: Number(service.dataValues.total_favorites) || 0,
            };
            terminal.success(`readServiceReport.service.js | Service ${service.service_id} report: ${JSON.stringify(report)}`);
            return report;
        });

        const total = serviceReport.reduce(
            (acc, curr) => ({
                total_orders: acc.total_orders + curr.total_orders,
                total_canceled_orders: acc.total_canceled_orders + curr.total_canceled_orders,
                total_completed_orders: acc.total_completed_orders + curr.total_completed_orders,
                total_pending_orders: acc.total_pending_orders + curr.total_pending_orders,
                total_processing_orders: acc.total_processing_orders + curr.total_processing_orders,
                total_favorites: acc.total_favorites + curr.total_favorites,
            }),
            {
                total_orders: 0,
                total_canceled_orders: 0,
                total_completed_orders: 0,
                total_pending_orders: 0,
                total_processing_orders: 0,
                total_favorites: 0,
            }
        );

        const total_services = serviceReport.length;
        const total_pages = service_id ? 1 : Math.ceil(total_services / max_range) || 1;
        const startIndex = (index - 1) * max_range;
        const endIndex = startIndex + max_range;
        const paginatedServices = serviceReport.slice(startIndex, endIndex);

        return {
            total_pages: total_pages,
            current_page: index,
            services: paginatedServices,
            total: service_id ? (paginatedServices[0] || {}) : total,
        };
    } catch (error) {
        terminal.error(`readServiceReport.service.js | Error generating service report: ${error.message}`);
        throw error;
    }
};
