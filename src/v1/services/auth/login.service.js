const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const client = require('../../../configs/redis.config');
const terminal = require('../../../utils/terminal');
const { Authentication, User } = require('../../models/index.model');
const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Authenticate a user and generate JWT tokens.
 * @param {string} identifier_email - Encrypted user email.
 * @param {string} password - User password.
 * @returns -1 for any error
 * @returns {Object} accessToken and refreshToken - JWT tokens.
 */
module.exports = async (identifier_email, password) => {
    const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET_KEY;
    const ACCESS_TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN;
    const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET_KEY;
    const REFRESH_TOKEN_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN;
    const SECRET_KEY = process.env.DB_SECRET_KEY;

    return Authentication.findOne({
        attributes: [
            'authentication_id',
            [Sequelize.literal(`CAST(AES_DECRYPT(identifier_email, '${SECRET_KEY}') AS CHAR)`), 'email'],
            [Sequelize.literal(`CAST(AES_DECRYPT(password, '${SECRET_KEY}') AS CHAR)`), 'password'],
        ],
        where: Sequelize.literal(`identifier_email = AES_ENCRYPT('${identifier_email}', '${SECRET_KEY}')`),
        raw: true,
    })
    .then(async (authRecord) => {
        if (!authRecord) {
            terminal.error(`login.service.js | Cannot find email in database | ${identifier_email}`);
            return -1;
        }

        const passwordMatch = await bcrypt.compare(password, authRecord.password);
        if (!passwordMatch) {
            terminal.error(`login.service.js | Password mismatch`);
            return -1;
        }

        const user = await User.findOne({ where: { authentication_id: authRecord.authentication_id } });
        if (!user) {
            terminal.error(`login.service.js | User of aid[${authRecord.authentication_id}] not exist`);
            return -1;
        }

        const payload = { user_id: user.user_id };
        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        const expirySeconds = parseInt(REFRESH_TOKEN_EXPIRY, 10) * 86400;
        await client.setEx(user.user_id.toString(), expirySeconds, refreshToken);

        terminal.success(`login.service.js | Tokens generated successfully`);
        return { accessToken, refreshToken };
    })
    .catch(err => {
        terminal.error(`login.service.js | Query failed: ${err.message}`);
        return -1;
    });
};
