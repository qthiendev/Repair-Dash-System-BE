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
module.exports = async (token) => {
    try {
        if (!token) {
            terminal.warning('getRole.service.js | No access token provided.');
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const storedToken = await client.get(decoded.user_id.toString());
        if (!storedToken) {
            terminal.warning(`getRole.service.js | No active session for user_id: ${decoded.user_id}`);
            return null;
        }

        const user = await User.findOne({
            where: { user_id: decoded.user_id, delete_flag: false },
            include: {
                model: Authentication,
                as: 'authentication',
                attributes: ['role'],
            },
        });

        if (!user || !user.authentication) {
            terminal.warning(`getRole.service.js | User not found or missing authentication: user_id ${decoded.user_id}`);
            return null;
        }

        terminal.info(`getRole.service.js | Retrieved role for user_id ${decoded.user_id}: ${user.authentication.role}`);
        return user.authentication.role;
    } catch (err) {
        terminal.error(`getRole.service.js | Error retrieving role: ${err.message}`);
        return null;
    }
};
