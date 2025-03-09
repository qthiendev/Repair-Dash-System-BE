const { Order, User, Authentication, Service, Employee } = require('../../models/index.model');
const { Op } = require('sequelize');
const terminal = require('../../../utils/terminal');

/**
 * Retrieves all non-deleted orders or a specific order by ID.
 * Ensures only ADMIN, the order's customer, or the service owner can access.
 * @param {number|null} order_id - The ID of the order (optional).
 * @param {number} user_id - The user making the request.
 * @returns {Promise<Object[]|Object|number>} Orders list, specific order, -1 if not found, or -2 if unauthorized.
 */
module.exports = async (order_id = null, user_id) => {
    const user = await User.findOne({
        where: { user_id },
        include: {
            model: Authentication,
            as: 'authentication',
            attributes: ['role'],
        },
    });

    if (!user || !user.authentication) {
        terminal.warning(`order.service.js | No authentication record found for user ${user_id}.`);
        return -2;
    }

    const role = user.authentication.role;

    if (order_id) {
        return await getSingleOrder(order_id, user_id, role);
    } else {
        return await getUserOrders(user_id, role);
    }
};

/**
 * Fetches a single order and checks permissions.
 * Includes Service with Owner and Employee if assigned.
 * @param {number} order_id - The ID of the order.
 * @param {number} user_id - The user making the request.
 * @param {string} role - The role of the user (ADMIN, STORE, CUSTOMER).
 * @returns {Promise<Object|number>} Order details or error code.
 */
const getSingleOrder = async (order_id, user_id, role) => {
    const order = await Order.findOne({
        where: { order_id, delete_flag: false },
        attributes: { exclude: ['delete_flag'] },
    });

    if (!order) {
        terminal.warning(`order.service.js | Order ${order_id} not found.`);
        return -1;
    }

    if (role !== 'ADMIN' && order.customer_id !== user_id && order.service?.owner?.user_id !== user_id) {
        terminal.warning(`order.service.js | User ${user_id} not authorized to access order ${order_id}.`);
        return -2;
    }

    return order;
};

/**
 * Fetches all orders for a user based on their role.
 * Includes Service with Owner and Employee if assigned.
 * @param {number} user_id - The user making the request.
 * @param {string} role - The role of the user.
 * @returns {Promise<Object[]>} List of orders.
 */
const getUserOrders = async (user_id, role) => {
    const whereCondition = { delete_flag: false };

    if (role !== 'ADMIN') {
        whereCondition[Op.or] = [{ customer_id: user_id }, { '$service.owner_id$': user_id }];
    }

    return await Order.findAll({
        where: whereCondition,
        attributes: { exclude: ['delete_flag'] }
    });
};
