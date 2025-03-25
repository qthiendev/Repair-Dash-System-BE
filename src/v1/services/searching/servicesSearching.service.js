const { User, Service, Order } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');
const distanceEstimate = require('./distantEstimate.service');
const { Op, fn, col } = require('sequelize');

/**
 * Converts a string to ASCII lowercase and removes diacritics.
 * @param {string} str - The input string.
 * @returns {string} The normalized string.
 */
const normalizeString = (str) => {
    return str
        ? str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
        : "";
};

/**
 * Searches for services based on location, keyword relevance, and distance.
 * Supports pagination with 'index' and 'max_range'.
 * @param {string} keyword - The search keyword.
 * @param {string} user_city - The user's city (optional).
 * @param {string} user_district - The user's district (optional).
 * @param {string} user_ward - The user's ward (optional).
 * @param {string} user_street - The user's street (optional).
 * @param {number} index - The page index (starting from 1).
 * @param {number} max_range - The number of services per page.
 * @returns {Promise<Array>} A list of matching services sorted by priority.
 */
module.exports = async (keyword = '', user_city, user_district, user_ward, user_street, index = 1, max_range = 20) => {
    try {
        const normKeyword = normalizeString(keyword);
        const normCity = normalizeString(user_city);
        const normDistrict = normalizeString(user_district);
        const normWard = normalizeString(user_ward);
        const normStreet = normalizeString(user_street);

        const services = await Service.findAll({
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: [
                        'user_full_name', 
                        'user_city',
                        'user_district',
                        'user_ward',
                        'user_street',
                        'user_avatar_url',
                        'user_priority'
                    ],
                    where: { delete_flag: false },
                },
                {
                    model: Order,
                    as: 'orders',
                    attributes: [
                        [fn('AVG', col('orders.order_rating')), 'avg_rating'],
                        [fn('COUNT', col('orders.order_id')), 'order_times'],
                    ],
                }
            ],
            where: { delete_flag: false },
            attributes: { exclude: ['delete_flag'] },
            group: ['Service.service_id', 'owner.user_id'],
            raw: true,
            nest: true,
        });
        
        const SCORE_CITY_MATCH = 1000;
        const SCORE_DISTRICT_MATCH = 900;
        const SCORE_WARD_MATCH = 800;
        const SCORE_STREET_MATCH = 700;
        const SCORE_DISTANCE_BASE = 600;

        const SCORE_SERVICE_NAME_STARTS = 500;
        const SCORE_SERVICE_NAME_CONTAINS = 400;
        const SCORE_OWNER_NAME_STARTS = 300;
        const SCORE_OWNER_NAME_CONTAINS = 200;
        const SCORE_DESCRIPTION_MATCH = 100;

        const SCORE_AVG_RATING_MULTIPLIER = 10;
        const SCORE_ORDER_TIMES_MULTIPLIER = 1;
        const SCORE_USER_PRIORITY_MULTIPLIER = 400;

        const servicesWithPriority = await Promise.all(services.map(async (service) => {
            const owner = service.owner || {};
            const serviceName = normalizeString(service.service_name || '');
            const serviceDescription = normalizeString(service.service_description || '');
            const ownerName = normalizeString(owner.user_full_name || '');
            const ownerCity = normalizeString(owner.user_city || '');
            const ownerDistrict = normalizeString(owner.user_district || '');
            const ownerWard = normalizeString(owner.user_ward || '');
            const ownerStreet = normalizeString(owner.user_street || '');

            let priority = 0;

            if (normCity && ownerCity.includes(normCity)) priority += SCORE_CITY_MATCH;
            if (normDistrict && ownerDistrict.includes(normDistrict)) priority += SCORE_DISTRICT_MATCH;
            if (normWard && ownerWard.includes(normWard)) priority += SCORE_WARD_MATCH;
            if (normStreet && ownerStreet.includes(normStreet)) priority += SCORE_STREET_MATCH;

            let distance = null;

            // distance = await distanceEstimate(
            //     {
            //         city: user_city,
            //         district: user_district,
            //         ward: user_ward,
            //         street: user_street
            //     },
            //     {
            //         city: owner.user_city,
            //         district: owner.user_district,
            //         ward: owner.user_ward,
            //         street: owner.user_street
            //     }
            // );

            if (distance !== null) {
                priority += SCORE_DISTANCE_BASE / (distance > 0 ? distance : 1);
            }

            if (normKeyword) {
                if (serviceName.startsWith(normKeyword)) priority += SCORE_SERVICE_NAME_STARTS;
                else if (serviceName.includes(normKeyword)) priority += SCORE_SERVICE_NAME_CONTAINS;
                if (ownerName.startsWith(normKeyword)) priority += SCORE_OWNER_NAME_STARTS;
                else if (ownerName.includes(normKeyword)) priority += SCORE_OWNER_NAME_CONTAINS;
                if (serviceDescription.includes(normKeyword)) priority += SCORE_DESCRIPTION_MATCH;
            }

            const avgRating = parseFloat(service.orders.avg_rating) || 0;
            const orderTimes = parseInt(service.orders.order_times) || 0;

            priority += avgRating * SCORE_AVG_RATING_MULTIPLIER;
            priority += orderTimes * SCORE_ORDER_TIMES_MULTIPLIER;
            priority += owner.user_priority * SCORE_USER_PRIORITY_MULTIPLIER;

            return {
                service_id: service.service_id,
                service_alias: service.service_alias,
                service_name: service.service_name,
                service_image: service.service_image_url || null,
                owner_id: service.owner_id,
                owner: {
                    user_full_name: owner.user_full_name,
                    user_avatar: owner.user_avatar_url || null,
                    user_priority: owner.user_priority
                },
                avg_rating: avgRating,
                order_times: orderTimes,
                distance: distance,
                priority: priority
            };
        }));

        const sortedServices = servicesWithPriority.sort((a, b) => b.priority - a.priority);

        const startIndex = (index - 1) * max_range;
        const endIndex = startIndex + max_range;

        const paginatedServices = sortedServices.slice(startIndex, endIndex);

        return paginatedServices;

    } catch (error) {
        terminal.error(`searchService.js | Error: ${error.message}`);
        return [];
    }
};
