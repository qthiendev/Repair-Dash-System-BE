const { Order, User, Authentication } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');

/**
 * Soft deletes an order by setting `delete_flag = true`.
 * Ensures only Admins or the order's customer can delete.
 *
 * @param {number} order_id - The ID of the order to delete.
 * @param {number} user_id - The ID of the user making the request.
 * @returns {Promise<number>} 1 if successful, or an error code.
 */
module.exports = async (order_id, user_id) => {
    const order = await Order.findByPk(order_id);

    if (!order) {
        terminal.warning(`deleteOrder.service.js | Order ${order_id} not found.`);
        return -1;
    }

    if (order.delete_flag) {
        terminal.warning(`deleteOrder.service.js | Order ${order_id} is already deleted.`);
        return -2;
    }

    const user = await User.findByPk(user_id, {
        include: {
            model: Authentication,
            as: 'authentication',
            attributes: ['role'],
        },
    });

    if (!user || !user.authentication) {
        terminal.warning(`deleteOrder.service.js | No authentication record found for user ${user_id}.`);
        return -4;
    }

    if (user.authentication.role!== 'ADMIN') {
        terminal.warning(`deleteOrder.service.js | User ${user_id} not authorized to delete order ${order_id}.`);
        return -3;
    }

    await order.update({ delete_flag: true });
    terminal.info(`deleteOrder.service.js | Order ${order_id} soft deleted.`);
    return 1;
};
