const { Order, Employee, User, Authentication } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');

/**
 * Updates an existing order with authorization.
 * 
 * @param {number} order_id - The ID of the order to update.
 * @param {number} user_id - The ID of the user making the request.
 * @param {Object} updateData - The fields to update.
 * @returns {Promise<Object|number>} Updated order or error codes (-1, -3, -4).
 */
module.exports = async (order_id, user_id, updateData) => {
    const order = await Order.findByPk(order_id, {
        include: {
            model: User,
            as: 'customer',
            attributes: ['user_id'],
        },
    });

    if (!order) {
        terminal.warning(`updateOrder.service.js | Order ${order_id} not found.`);
        return -1;
    }

    const user = await User.findByPk(user_id, {
        include: {
            model: Authentication,
            as: 'authentication',
            attributes: ['role'],
        },
    });

    if (!user || !user.authentication) {
        terminal.warning(`updateOrder.service.js | No authentication record found for user ${user_id}.`);
        return -3;
    }

    const role = user.authentication.role;

    if (role !== 'ADMIN' && order.customer.user_id !== user_id) {
        terminal.warning(`updateOrder.service.js | User ${user_id} not authorized to update order ${order_id}.`);
        return -3;
    }

    let updateFields = {};

    if ('employee_id' in updateData) {
        if (updateData.employee_id === null) {
            updateFields.employee_id = null;
            updateFields.employee_full_name = null;
        } else {
            const employee = await Employee.findByPk(updateData.employee_id);
            if (!employee) {
                terminal.warning(`updateOrder.service.js | Employee ${updateData.employee_id} not found.`);
                return -2;
            }

            updateFields.employee_id = employee.employee_id;
            updateFields.employee_full_name = employee.employee_full_name;
        }
    }

    if (updateData.customer_full_name) updateFields.customer_full_name = updateData.customer_full_name;
    if (updateData.customer_phone_number) updateFields.customer_phone_number = updateData.customer_phone_number;
    if (updateData.customer_address) updateFields.customer_address = updateData.customer_address;
    if (updateData.order_description) updateFields.order_description = updateData.order_description;

    await order.update(updateFields);
    terminal.info(`updateOrder.service.js | Order ${order_id} updated successfully.`);
    return order;
};
