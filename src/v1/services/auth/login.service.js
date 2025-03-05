const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const client = require('../../../configs/redis.config');
const terminal = require('../../../utils/terminal');
const { Authentication, User } = require('../../models/index.model');
require('dotenv').config();

/**
 * Authenticate a user and generate JWT tokens securely.
 * @param {string} identifier_email - User email (encrypted in DB).
 * @param {string} password - User password.
 * @returns -1 for any error
 * @returns {Object} accessToken and refreshToken - JWT tokens.
 */
module.exports = async (identifier_email, password) => {
    try {
        const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY;
        const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN;
        const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
        const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN;

        const authRecord = await Authentication.findOne({
            attributes: ['authentication_id', 'identifier_email', 'password'],
            where: { identifier_email },
            raw: true,
        });

        if (!authRecord) {
            terminal.error(`login.service.js | Email not found`);
            return -1;
        }

        const passwordMatch = await bcrypt.compare(password, authRecord.password);
        if (!passwordMatch) {
            terminal.error(`login.service.js | Incorrect password`);
            return -1;
        }

        const user = await User.findOne({ where: { authentication_id: authRecord.authentication_id } });
        if (!user) {
            terminal.error(`login.service.js | User not found`);
            return -1;
        }

        const payload = { user_id: user.user_id };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });

        const refreshTokenPayload = {
            user_id: user.user_id,
            token_id: crypto.randomUUID(),
        };
        const refreshToken = jwt.sign(refreshTokenPayload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        const expirySeconds = jwt.decode(refreshToken).exp - Math.floor(Date.now() / 1000);

        const redisKey = `refresh:${user.user_id}:${refreshTokenPayload.token_id}`;
        await client.setEx(redisKey, expirySeconds, refreshToken);

        terminal.success(`login.service.js | Tokens generated successfully`);
        return { accessToken, refreshToken };
    } catch (err) {
        terminal.error(`login.service.js | Error: ${err.message}`);
        return -1;
    }
};
