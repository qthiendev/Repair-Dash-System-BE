const { Order, User, Service } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');
const uploadMedia = require('../cloudinary/uploadMedia.service');
const createRTCSession = require('../rtc/createRTCSession.service');
const { or } = require('sequelize');

/**
 * Creates a new order.
 * @param {number} customer_id - ID of the customer placing the order.
 * @param {number} service_id - ID of the service being ordered.
 * @param {string} customer_full_name - Customer's full name.
 * @param {string} customer_phone_number - Customer's phone number.
 * @param {string} customer_address - Customer's address.
 * @param {string} order_description - Description of the order.
 * @returns {Promise<number>} Created order ID or error codes (-1, -2, -3, -4).
 */
module.exports = async (customer_id, service_id, customer_full_name, customer_phone_number, customer_address, order_description, order_images) => {
    const customer = await User.findByPk(customer_id);
    if (!customer) {
        terminal.warning(`order.service.js | Customer ${customer_id} not found.`);
        return -1;
    }

    const service = await Service.findByPk(service_id, {
        include: {
            model: User,
            as: 'owner',
            attributes: ['user_full_name', 'user_phone_number', 'user_street', 'user_ward', 'user_district', 'user_city'],
        },
    });

    if (!service) {
        terminal.warning(`order.service.js | Service ${service_id} not found.`);
        return -2;
    }

    if (!service.owner) {
        terminal.warning(`order.service.js | Store not found for service ${service_id}.`);
        return -3;
    }

    if (service.owner_id === customer_id) {
        terminal.warning(`order.service.js | Store ${service.owner_id} (customer ${customer_id}) cannot order its own service ${service_id}.`);
        return -4;
    }

    const store_full_name = service.owner.user_full_name;
    const store_phone_number = service.owner.user_phone_number;
    const store_address = `${service.owner.user_street}, ${service.owner.user_ward}, ${service.owner.user_district}, ${service.owner.user_city}`;

    const service_name = service.service_name;
    const service_description = service.service_description;

    const newOrder = await Order.create({
        customer_id,
        service_id,
        order_description: `[Khách hàng đặt đơn: ${order_description}]`,
        order_status: 'PENDING',
        service_name,
        service_description,
        store_full_name,
        store_address,
        store_phone_number,
        customer_full_name,
        customer_phone_number,
        customer_address,
        employee_id: null,
        employee_full_name: null,
    });

    
    const folderUrl = await uploadMedia.uploadImages(`order_${newOrder.order_id}`, order_images);
    await createRTCSession(newOrder.order_id);

    if (folderUrl) {
        await Order.update({ order_images_url: folderUrl }, { where: { order_id: newOrder.order_id } });
    }

    return newOrder.order_id;
};
