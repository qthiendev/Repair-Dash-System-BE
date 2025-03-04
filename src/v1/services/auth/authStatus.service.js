const jwt = require('jsonwebtoken');
const client = require('../../../configs/redis.config');
const terminal = require('../../../utils/terminal');
require('dotenv').config();

/**
 * Authenticate a user and generate JWT tokens.
 * @param {string} identifier_email - Encrypted user email.
 * @param {string} password - User password.
 * @returns -1 for any error
 * @returns {Object} accessToken and refreshToken - JWT tokens.
 */
module.exports = async (token) => {
    if (!token) {
        terminal.warning('authStatus.service.js | No access token provided.');
        return { status: false, user_id: null };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const storedToken = await client.get(decoded.user_id.toString());

    if (!storedToken) {
        terminal.warning('authStatus.service.js | No active session found.');
        return { status: false, user_id: decoded.user_id };
    }

    return { status: true, user_id: decoded.user_id };
};
