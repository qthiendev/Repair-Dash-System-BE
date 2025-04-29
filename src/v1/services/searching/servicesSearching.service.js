const { User, Service, Order } = require('../../models/index.model');
const terminal = require('../../../utils/terminal');
const distanceEstimate = require('./distantEstimate.service');
const { Op, fn, col } = require('sequelize');
const stringSimilarity = require('string-similarity');

/**
 * Converts a string to ASCII lowercase and removes diacritics.
 * @param {string} str - The input string.
 * @returns {string} The normalized string.
 */
const normalizeString = (str) => {
    return str ? str.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase() : "";
};

/**
 * Calculates similarity score multiplier.
 * @param {string} input - Normalized user input.
 * @param {string} target - Normalized service field.
 * @param {number} weight - Max weight to apply.
 * @returns {number} Score based on similarity ratio.
 */
const similarityScore = (input, target, weight) => {
    if (!input || !target) return 0;
    const score = stringSimilarity.compareTwoStrings(target, input);
    return score * weight;
};

/**
 * Calculates all priority points for a given service.
 */
const calculateServicePriority = async (service, normInput) => {
    const {
        normKeyword,
        normCity,
        normDistrict,
        normWard,
        normStreet,
        user_city,
        user_district,
        user_ward,
        user_street
    } = normInput;

    const owner = service.owner || {};

    const serviceName = normalizeString(service.service_name || '');
    const serviceDescription = normalizeString(service.service_description || '');
    const ownerName = normalizeString(owner.user_full_name || '');
    const ownerCity = normalizeString(owner.user_city || '');
    const ownerDistrict = normalizeString(owner.user_district || '');
    const ownerWard = normalizeString(owner.user_ward || '');
    const ownerStreet = normalizeString(owner.user_street || '');

    const LOCATION_WEIGHTS = {
        city: 1000,
        district: 900,
        ward: 800,
        street: 700
    };

    const KEYWORD_WEIGHTS = {
        exact_service_name: 1000,
        partial_service_name: 500,
        exact_owner_name: 600,
        partial_owner_name: 300,
        description_match: 100
    };

    const OTHER_MULTIPLIERS = {
        distance: 600,
        avg_rating: 10,
        order_times: 1,
        user_priority: 400
    };

    let priority = 0;

    priority += similarityScore(normCity, ownerCity, LOCATION_WEIGHTS.city);
    priority += similarityScore(normDistrict, ownerDistrict, LOCATION_WEIGHTS.district);
    priority += similarityScore(normWard, ownerWard, LOCATION_WEIGHTS.ward);
    priority += similarityScore(normStreet, ownerStreet, LOCATION_WEIGHTS.street);

    var timeEstimate = "hơn 30 phút";

    if (priority > 3000) {
        timeEstimate = "khoảng 5 phút";
    } else if (priority > 2500) {
        timeEstimate = "khoảng 10 phút";
    } else if (priority > 2000) {
        timeEstimate = "khoảng 15 phút";
    } else if (priority > 1500) {
        timeEstimate = "khoảng 20 phút";
    } else if (priority > 1000) {
        timeEstimate = "khoảng 30 phút";
    }

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
        priority += OTHER_MULTIPLIERS.distance / (distance > 0 ? distance : 1);
    }

    if (normKeyword) {
        if (serviceName === normKeyword) priority += KEYWORD_WEIGHTS.exact_service_name;
        else priority += similarityScore(normKeyword, serviceName, KEYWORD_WEIGHTS.partial_service_name);

        if (ownerName === normKeyword) priority += KEYWORD_WEIGHTS.exact_owner_name;
        else priority += similarityScore(normKeyword, ownerName, KEYWORD_WEIGHTS.partial_owner_name);

        priority += similarityScore(normKeyword, serviceDescription, KEYWORD_WEIGHTS.description_match);
    }

    const avgRating = parseFloat(service.orders.avg_rating) || 0;
    const orderTimes = parseInt(service.orders.order_times) || 0;

    priority += avgRating * OTHER_MULTIPLIERS.avg_rating;
    priority += orderTimes * OTHER_MULTIPLIERS.order_times;
    priority += (owner.user_priority || 0) * OTHER_MULTIPLIERS.user_priority;

    return {
        service_id: service.service_id,
        service_alias: service.service_alias,
        service_name: service.service_name,
        service_image: service.service_image_url || null,
        owner_id: service.owner_id,
        owner: {
            user_full_name: owner.user_full_name,
            user_alias: owner.user_alias,
            user_avatar: owner.user_avatar_url || null,
            user_priority: owner.user_priority
        },
        avg_rating: avgRating,
        order_times: orderTimes,
        distance: distance,
        time: timeEstimate,
        priority: priority
    };
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
 * @returns {Promise<Object>} Paginated list of matching services.
 */
module.exports = async (keyword = '', user_city, user_district, user_ward, user_street, index = 1, max_range = 20, name_only = 'false') => {
    try {
        if (index < 1) index = 1;

        if (name_only === 'true') {
            const services = await Service.findAll({
                where: {
                    delete_flag: false
                },
                attributes: ['service_name'],
            });

            const uniqueServiceNames = [...new Set(services.map(service => service.service_name))];
            return {
                services_name: uniqueServiceNames
            };
        }

        const normInput = {
            normKeyword: normalizeString(keyword),
            normCity: normalizeString(user_city),
            normDistrict: normalizeString(user_district),
            normWard: normalizeString(user_ward),
            normStreet: normalizeString(user_street),
            user_city,
            user_district,
            user_ward,
            user_street
        };

        const services = await Service.findAll({
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: [
                        'user_full_name',
                        'user_alias',
                        'user_city',
                        'user_district',
                        'user_ward',
                        'user_street',
                        'user_avatar_url',
                        'user_priority'
                    ],
                    where: { delete_flag: false }
                },
                {
                    model: Order,
                    as: 'orders',
                    attributes: [
                        [fn('AVG', col('orders.order_rating')), 'avg_rating'],
                        [fn('COUNT', col('orders.order_id')), 'order_times']
                    ]
                }
            ],
            where: { delete_flag: false },
            attributes: { exclude: ['delete_flag'] },
            group: ['Service.service_id', 'owner.user_id'],
            raw: true,
            nest: true
        });

        const servicesWithPriority = await Promise.all(
            services.map(service => calculateServicePriority(service, normInput))
        );

        const sortedServices = servicesWithPriority.sort((a, b) => b.priority - a.priority);

        const total_services = sortedServices.length;
        const total_pages = Math.ceil(total_services / max_range);
        const startIndex = (index - 1) * max_range;
        const endIndex = startIndex + max_range;

        return {
            total_pages: total_pages,
            current_page: Number.parseInt(index),
            services: sortedServices.slice(startIndex, endIndex)
        };
    } catch (error) {
        terminal.error(`searchService.js | Error: ${error.message}`);
        return {
            total_pages: 0,
            current_page: index,
            services: []
        };
    }
};
