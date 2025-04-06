const jwt = require('jsonwebtoken');
const client = require('../../../configs/redis.config');
const terminal = require('../../../utils/terminal');
const { User, Authentication } = require('../../models/index.model');
require('dotenv').config();

/**
 * Get the role of a user based on their access token.
 * @param {string} token - The JWT access token.
 * @returns {Promise<string|null>} The role of the user or null if not found.
 */
exports.byToken = async (token) => {
    if (!token) {
        terminal.warning('getRole.service.js | No access token provided.');
        return null;
    }

    return this.byID(jwt.verify(token, process.env.JWT_SECRET_KEY).user_id);
};

/**
 * Get the role of a user based on their user id.
 * @param {int} uid - The user id.
 * @returns {Promise<string|null>} The role of the user or null if not found.
 */
exports.byID = async (uid) => {
    const user = await User.findOne({
        where: { user_id: uid, delete_flag: false },
        include: {
            model: Authentication,
            as: 'authentication',
            attributes: ['role'],
        },
        nest: true,
    });

    if (!user || !user.authentication) {
        terminal.warning(`getRole.service.js | User not found or missing authentication: user_id ${uid}`);
        return null;
    }

    terminal.info(`getRole.service.js | Retrieved role for user_id ${uid}: ${user.authentication.role}`);
    return user.authentication.role;
};
