const { User, Authentication } = require('../../models/index.model');
const { Op } = require('sequelize');
const terminal = require('../../../utils/terminal');

/**
 * Generates a user statistics report, counting all users, store users, customer users, admin users,
 * and listing users with their ID, alias, full name, created date, and email.
 * Excludes users with delete_flag = true in User or Authentication models.
 * @returns {Promise<Object>} Report with user counts and list of users.
 */
module.exports = async (index = 1, max_range = 20, filters = {}) => {
    if (index < 1) index = 1;

    const userWhere = {};
    if (filters.user_id) userWhere.user_id = filters.user_id;
    if (filters.user_full_name) userWhere.user_full_name = { [Op.like]: `%${filters.user_full_name}%` };
    if (filters.user_alias) userWhere.user_alias = { [Op.like]: `%${filters.user_alias}%` };
    if (filters.user_phone_number) userWhere.user_phone_number = { [Op.like]: `%${filters.user_phone_number}%` };

    const authWhere = { delete_flag: false };
    if (filters.role) authWhere.role = filters.role;
    if (filters.identifier_email) authWhere.identifier_email = { [Op.like]: `%${filters.identifier_email}%` };

    const totalUsers = await User.count({
        where: userWhere,
        include: [{
            model: Authentication,
            as: 'authentication',
            where: authWhere,
            attributes: []
        }]
    });

    const storeUsers = await User.count({
        where: userWhere,
        include: [{
            model: Authentication,
            as: 'authentication',
            where: {
                role: 'STORE',
                delete_flag: false
            },
            attributes: []
        }]
    });

    const customerUsers = await User.count({
        where: userWhere,
        include: [{
            model: Authentication,
            as: 'authentication',
            where: {
                role: 'CUSTOMER',
                delete_flag: false
            },
            attributes: []
        }]
    });

    const adminUsers = await User.count({
        where: userWhere,
        include: [{
            model: Authentication,
            as: 'authentication',
            where: {
                role: 'ADMIN',
                delete_flag: false
            },
            attributes: []
        }]
    });

    const users = await User.findAll({
        where: userWhere,
        include: [{
            model: Authentication,
            as: 'authentication',
            where: authWhere,
            attributes: ['authentication_id', 'identifier_email', 'role', 'delete_flag', 'created_at', 'updated_at']
        }],
        order: [['user_id', 'ASC']],
        limit: max_range,
        offset: (index - 1) * max_range
    });

    const userList = users.map(user => ({
        ...user.toJSON(),
        authentication: user.authentication.toJSON(),
        is_locked: user.delete_flag
    }));

    const total_pages = Math.ceil(totalUsers / max_range) || 1;

    terminal.success(`getUserStatistics.service.js | Retrieved user statistics: ${totalUsers} total users, ${storeUsers} store users, ${customerUsers} customer users, ${adminUsers} admin users, page ${index} of ${total_pages}, filters: ${JSON.stringify(filters)}`);

    return {
        total_users: totalUsers,
        total_store_users: storeUsers,
        total_customer_users: customerUsers,
        total_admin_users: adminUsers,
        users: userList,
        total_pages: total_pages,
        current_page: index
    };
};
