const loginService = require('../services/auth/login.service');
const refreshService = require('../services/auth/refreshToken.service');
const logoutService = require('../services/auth/logout.service');
const authStatusService = require('../services/auth/authStatus.service');
const createUser = require('../services/user/createUser.service');
const terminal = require('../../utils/terminal');

/**
 * Check authentication status.
 * @route GET /api/v1/auth/status
 */
exports.status = async (req, res) => {
    try {
        const token = req.cookies?.accessToken;
        const { status, user_id } = await authStatusService(token);

        if (status && user_id) {
            terminal.info(`status.service.js | User ${user_id} currently active.`);
        }

        return res.status(200).json({ auth_status: status, user_id: user_id });
    } catch (err) {
        terminal.error(`Login Error: ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Authenticate user and generate JWT tokens.
 * @route POST /api/v1/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { identifier_email, password } = req.body;
        terminal.info(`auth.controller.js | Login attempt for: ${identifier_email} | ${password}`);

        const tokens = await loginService(identifier_email, password);

        if (!tokens.accessToken) {
            terminal.error('auth.controller.js | Missing Access Token');
            return res.status(400).json({ message: 'Login failed.' });
        }

        if (!tokens.refreshToken) {
            terminal.error('auth.controller.js | Missing Refresh Token');
            return res.status(400).json({ message: 'Login failed.' });
        }

        if (tokens === -1) {
            terminal.error('auth.controller.js | Error from service');
            return res.status(400).json({ message: 'Login failed.' });
        }

        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        });

        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        });

        terminal.success(`auth.controller.js | Login successful: ${identifier_email} | ${password}`);
        return res.status(200).json({ message: 'Login successful.' });

    } catch (err) {
        terminal.error(`Login Error: ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Log out user by invalidating their tokens.
 * @route POST /api/v1/auth/logout
 */
exports.logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader?.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : req.cookies?.accessToken;

        if (!accessToken) {
            terminal.error('Logout attempt with no access token.');
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const result = await logoutService(accessToken);

        if (result === -1) {
            terminal.error('Logout failed: Invalid or expired token.');
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        res.clearCookie('accessToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });
        res.clearCookie('refreshToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'Lax', path: '/' });

        terminal.success('User logged out successfully.');
        return res.status(200).json({ message: 'Logged out successfully' });

    } catch (err) {
        terminal.error(`Logout Error: ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Refresh access token using refresh token.
 * @route POST /api/v1/auth/refresh
 */
exports.refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;

        if (!refreshToken) {
            terminal.warning('Refresh token missing in request.');
            return res.status(403).json({ message: 'No refresh token provided' });
        }

        const newAccessToken = await refreshService(refreshToken);
        if (newAccessToken === -1) {
            terminal.error('Invalid or expired refresh token.');
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            path: '/',
        });

        terminal.info('Access token refreshed and set in cookies successfully.');
        return res.status(200).json({ message: 'Refresh successful.' });

    } catch (err) {
        terminal.error(`Refresh Token Error: ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Register a new user.
 * @route POST /api/v1/auth/register
 */
exports.register = async (req, res) => {
    try {
        const {
            identifier_email,
            password,
            role,
            user_full_name,
            user_phone_number,
            user_address
        } = req.body;

        const authData = { identifier_email, password, role };
        const userData = { user_full_name, user_phone_number, user_address };

        terminal.info(`auth.controller.js | Register attempt for: ${identifier_email}`);

        const userId = await createUser(authData, userData);

        if (userId === -1) {
            terminal.warning(`auth.controller.js | Email already registered: ${identifier_email}`);
            return res.status(400).json({ message: 'Email already registered' });
        }

        terminal.success(`auth.controller.js | User registered successfully: ${identifier_email}`);
        return res.status(201).json({ message: 'User registered successfully', user_id: userId });

    } catch (err) {
        terminal.error(`Register Error: ${err.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};
