const jwt = require('jsonwebtoken');
const client = require('../../configs/redis.config');
const terminal = require('../../utils/terminal');
const getRole = require('../services/auth/getRole.service');

require('dotenv').config();

/**
 * Middleware to authenticate users using JWT.
 * Extracts token from cookies, verifies it, checks if it's blacklisted, 
 * and adds decoded user info to `req.user` if valid.
 */
exports.authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken;
        if (!token) {
            terminal.error('auth.middleware.js | Unauthorized. Token null');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const isBlacklisted = await client.get(`blacklist:${token}`);
        if (isBlacklisted) {
            terminal.error('auth.middleware.js | Token has been revoked');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = { user_id: decoded.user_id };
        next();
    } catch (err) {
        terminal.error(`auth.middleware.js | ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Middleware to ensure the user is logged out before accessing login.
 */
exports.unauthenticate = (req, res, next) => {
    const token = req.cookies?.accessToken;

    if (!token) {
        return next();
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET);
        return res.status(403).json({ message: 'You are already logged in' });
    } catch (err) {
        return next();
    }
};

/**
 * Middleware to check user roles dynamically.
 * @param {string} requiredRole - The role required to access the route.
 */
const ensureRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies?.accessToken;
            const userRole = await getRole(token);

            if (!userRole || userRole !== requiredRole) {
                if (!userRole)
                    terminal.error(`auth.middleware.js | User role not found.`);
                else
                    terminal.error(`auth.middleware.js | Access denied. Requires role: ${requiredRole}`);
                return res.status(403).json({ message: 'Access denied.' });
            }

            next();
        } catch (err) {
            terminal.error(`auth.middleware.js | Error checking role: ${err.message}`);
            return res.status(500).json({ message: 'Unexpected error occurred' });
        }
    };
};

exports.ensureAdmin = ensureRole('ADMIN');
exports.ensureStore = ensureRole('STORE');
exports.ensureCustomer = ensureRole('CUSTOMER');
