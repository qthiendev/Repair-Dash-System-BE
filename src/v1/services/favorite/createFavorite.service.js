const { Favorite, User, Service, Authentication } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');

/**
 * Checks if a user exists and is a valid customer.
 * @param {number} customer_id - The ID of the customer.
 * @returns {Promise<boolean>} True if the customer exists, otherwise false.
 */
const isValidCustomer = async (customer_id) => {
    const customer = await User.findByPk(customer_id);
    return !!customer;
};

/**
 * Checks if a store exists and has role 'STORE'.
 * @param {number} store_id - The ID of the store.
 * @returns {Promise<number>} Returns 1 if valid, -3 if not found, -5 if not a store.
 */
const isValidStore = async (store_id) => {
    const store = await User.findOne({ 
        where: { user_id: store_id, delete_flag: false }, 
        include: { model: Authentication, as: 'authentication', attributes: ['role'] }
    });

    if (!store) return -3;
    if (store.authentication?.role !== 'STORE') return -5;
    return 1;
};

/**
 * Checks if a service exists and is not deleted.
 * @param {number} service_id - The ID of the service.
 * @returns {Promise<boolean>} True if the service exists, otherwise false.
 */
const isValidService = async (service_id) => {
    const service = await Service.findOne({ where: { service_id, delete_flag: false } });
    return !!service;
};

/**
 * Creates a new favorite.
 * @param {number} customer_id - The ID of the customer.
 * @param {number|null} store_id - The ID of the store (optional).
 * @param {number|null} service_id - The ID of the service (optional).
 * @returns {Promise<number>} The created favorite ID or error codes (-1, -2, -3, -4, -5).
 */
module.exports = async (customer_id, store_id = null, service_id = null) => {
    if (!(await isValidCustomer(customer_id))) {
        terminal.warning(`createFavorite.service.js | Customer ${customer_id} not found.`);
        return -1;
    }

    if ((store_id && service_id) || (!store_id && !service_id)) {
        terminal.warning(`createFavorite.service.js | Must provide either store_id or service_id, but not both.`);
        return -2;
    }

    if (store_id) {
        const storeCheck = await isValidStore(store_id);
        if (storeCheck < 0) return storeCheck;

        const existing = await Favorite.findOne({ where: { customer_id, store_id } });
        if (existing) {
            terminal.warning(`createFavorite.service.js | Favorite already exists for customer ${customer_id} and store ${store_id}.`);
            return -6;
        }
    }

    if (service_id) {
        if (!(await isValidService(service_id))) {
            terminal.warning(`createFavorite.service.js | Service ${service_id} not found or deleted.`);
            return -4;
        }

        const existing = await Favorite.findOne({ where: { customer_id, service_id } });
        if (existing) {
            terminal.warning(`createFavorite.service.js | Favorite already exists for customer ${customer_id} and service ${service_id}.`);
            return -6;
        }
    }

    const favorite = await Favorite.create({ customer_id, store_id, service_id });
    return favorite.favorite_id;
};
