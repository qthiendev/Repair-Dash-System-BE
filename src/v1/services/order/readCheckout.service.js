const { User, Service, Employee } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');
const { Op, Sequelize, where } = require('sequelize');

/**
 * Fetches customer, service, and store owner details including available employees.
 * Employees currently assigned to "PROCESSING" orders are excluded.
 * @param {number} customer_id - The ID of the customer (User).
 * @param {number} service_id - The ID of the service.
 * @returns {Promise<Object|number>} The customer, service (with store inside), or error codes (-1, -2, -3, -4).
 */
module.exports = async (customer_id, service_id) => {
    const customer = await User.findByPk(customer_id, {
        attributes: { exclude: ['delete_flag'] },
    });

    if (!customer) {
        terminal.warning(`readCheckout.service.js | Customer ${customer_id} not found.`);
        return -1;
    }

    const service = await Service.findOne(
        {
            where: {
                [Op.or]: [
                    { service_id: service_id },
                    { service_alias: service_id }
                ],
                delete_flag: false
            },
            include: {
                model: User,
                as: 'owner',
                attributes: { exclude: ['user_phone_number', 'delete_flag'] },
                include: {
                    model: Employee,
                    as: 'employees',
                    attributes: { exclude: ['delete_flag'] },
                    where: {
                        employee_id: {
                            [Op.notIn]: Sequelize.literal(
                                `(SELECT DISTINCT employee_id FROM orders WHERE order_status = 'PROCESSING' AND employee_id IS NOT NULL)`
                            ),
                        },
                    },
                    required: false,
                },
            },
            attributes: { exclude: ['delete_flag'] },
            nest: true,
        });

    if (!service) {
        terminal.warning(`readCheckout.service.js | Service ${service_id} not found.`);
        return -2;
    }

    if (!service.owner) {
        terminal.warning(`readCheckout.service.js | Store not found for service ${service_id}.`);
        return -3;
    }

    if (service.owner_id === customer_id) {
        terminal.warning(`readCheckout.service.js | Store ${service.owner_id} (customer ${customer_id}) cannot order its own service ${service_id}.`);
        return -4;
    }

    return { customer, service };
};
