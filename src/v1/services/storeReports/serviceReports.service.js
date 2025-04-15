const { Service, Order, Favorite } = require('../../models/index.model');
const { Sequelize, Op } = require('sequelize');
const terminal = require('../../../utils/terminal');

/**
 * Generates a service report for a store user with pagination.
 * @param {number} user_id - The ID of the store user from the JWT token.
 * @param {number|string|null} service_id - Optional service ID or service alias to filter by.
 * @param {number} index - Page number (default 1).
 * @param {number} max_range - Items per page (default 20).
 * @returns {Promise<Object>} Report with services and totals, or single service with paginated orders.
 */
module.exports = async (user_id, service_id = null, index = 1, max_range = 10) => {
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
                    attributes: [
                        'order_id',
                        'order_status',
                        'order_feedback',
                        'order_rating',
                        'employee_full_name',
                        'customer_full_name',
                        'service_id',
                        'employee_id',
                        'customer_id',
                        'created_at',
                        'updated_at'
                    ],
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
            serviceQuery.where[Op.or] = [
                { service_id: service_id },
                { service_alias: service_id }
            ];
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
                orders: service_id ? service.orders.map(order => ({
                    order_id: order.order_id,
                    order_status: order.order_status,
                    order_feedback: order.order_feedback || null,
                    order_rating: order.order_rating || null,
                    employee_full_name: order.employee_full_name || null,
                    customer_full_name: order.customer_full_name || null,
                    service_id: order.service_id,
                    employee_id: order.employee_id || null,
                    customer_id: order.customer_id,
                    created_at: order.created_at,
                    updated_at: order.updated_at,
                })) : undefined,
            };
            terminal.success(`readServiceReport.service.js | Service ${service.service_id}`);
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
        
        if (service_id) {
            const singleReport = serviceReport[0] || {};
            const orders = singleReport.orders || [];
            const total_orders = singleReport.total_orders || 0;
            const total_pages = Math.ceil(total_orders / max_range) || 1;
            const startIndex = (index - 1) * max_range;
            const endIndex = startIndex + max_range;
            const paginatedOrders = orders.slice(startIndex, endIndex);

            return {
                total_pages: total_pages,
                current_page: index,
                service: {
                    ...singleReport.service,
                    total_orders: singleReport.total_orders || 0,
                    total_canceled_orders: singleReport.total_canceled_orders || 0,
                    total_completed_orders: singleReport.total_completed_orders || 0,
                    total_pending_orders: singleReport.total_pending_orders || 0,
                    total_processing_orders: singleReport.total_processing_orders || 0,
                    total_favorites: singleReport.total_favorites || 0,
                    orders: paginatedOrders
                },
                total: {
                    total_orders: singleReport.total_orders || 0,
                    total_canceled_orders: singleReport.total_canceled_orders || 0,
                    total_completed_orders: singleReport.total_completed_orders || 0,
                    total_pending_orders: singleReport.total_pending_orders || 0,
                    total_processing_orders: singleReport.total_processing_orders || 0,
                    total_favorites: singleReport.total_favorites || 0,
                }
            };
        }

        const total_services = serviceReport.length;
        const total_pages = Math.ceil(total_services / max_range) || 1;
        const startIndex = (index - 1) * max_range;
        const endIndex = startIndex + max_range;
        const paginatedServices = serviceReport.slice(startIndex, endIndex);

        terminal.debug(`${startIndex} - ${endIndex} | ${total_services} | ${max_range} | ${total_pages}`);
        return {
            total_pages: total_pages,
            current_page: index,
            services: paginatedServices,
            total: total,
        };
    } catch (error) {
        terminal.error(`readServiceReport.service.js | Error generating service report: ${error.message}`);
        throw error;
    }
};
