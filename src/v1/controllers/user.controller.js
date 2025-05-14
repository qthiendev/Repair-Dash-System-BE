const readUser = require('../services/user/readUser.service');
const createUser = require('../services/user/createUser.service');
const deleteUser = require('../services/user/deleteUser.service');
const updateUser = require('../services/user/updateUser.service');
const lockUser = require('../services/user/lockUser.service');
const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Create a new user.
 * @route POST /api/v1/user
 * @body {string} identifier_email - User's email (required)
 * @body {string} password - User's password (required)
 * @body {string} role - User's role (required)
 * @body {string} user_full_name - Full name of the user (required)
 * @body {string} user_phone_number - User's phone number (required)
 * @body {string} user_address - User's address (required)
 * @returns {Object} 201 - { user_id: number } if created successfully
 * @returns {Object} 400 - { message: 'User already exists' } if the email is already registered
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } if an internal error happens
 */
exports.createUser = async (req, res) => {
    try {
        const {
            identifier_email,
            password,
            role,
            user_full_name,
            user_alias,
            user_phone_number,
            user_street,
            user_ward,
            user_district,
            user_city,
        } = req.body;

        const authData = { identifier_email, password, role };
        const userData = { user_full_name, user_alias, user_phone_number, user_street, user_ward, user_district, user_city };

        const userID = await createUser(authData, userData);

        if (userID === -1) {
            return res.status(400).json({ message: 'User already exists', code: -1 });
        }

        if (userID === -2) {
            return res.status(400).json({ message: 'Alias already taken', code: -2 });
        }

        return res.status(201).json({ user_id: userID });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Retrieve user(s).
 * @route GET /api/v1/user/:user_id?
 * @param {string} [user_id] - (Optional) The ID of the user to retrieve. If omitted, returns all users.
 * @returns {Object} 200 - { data: users } if users are found
 * @returns {Object} 404 - { message: 'User not found' } if no user matches the given ID
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal server errors
 */
exports.readUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        let sub_user_id = null;
        try {
            if (req.cookies?.accessToken) {
                sub_user_id = jwt.verify(
                    req.cookies.accessToken,
                    process.env.JWT_SECRET_KEY
                ).user_id;
            }
        } catch (error) {
            console.error('Token verification failed:', error);
        }

        const users = await readUser(user_id, sub_user_id);

        if (!users) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user_id) {
            return res.status(200).json({ users });
        }

        return res.status(200).json({ ...users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Update user and authentication details.
 * @route PUT /api/v1/users/:user_id
 * @param {string} user_id - The ID of the user to update.
 * @body {string} [user_full_name] - User full name.
 * @body {string} [user_alias] - User alias.
 * @body {string} [user_phone_number] - User phone number.
 * @body {string} [user_description] - User description.
 * @body {string} [user_street] - User street address.
 * @body {string} [user_ward] - User ward.
 * @body {string} [user_district] - User district.
 * @body {string} [user_city] - User city.
 * @body {string} [identifier_email] - Authentication email.
 * @body {string} [password] - Authentication password.
 * @body {string} [role] - Authentication role.
 * @body {File} [avatar_image] - Avatar image file (optional).
 * @returns {Object} 200 - { message: 'User updated successfully', user, authentication } if the update was successful
 * @returns {Object} 400 - { message: 'Alias already taken' } if the user alias is taken
 * @returns {Object} 404 - { message: 'User not found or already deleted' } if no user with the given ID exists
 * @returns {Object} 500 - { message: 'Failed to update user' } if the update failed
 */
exports.updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const {
            user_full_name,
            user_alias,
            user_priority,
            user_phone_number,
            user_description,
            user_street,
            user_ward,
            user_district,
            user_city,
            identifier_email,
            password,
            role,
            avatar_image
        } = req.body;

        const updateData = {
            user: {
                user_full_name,
                user_alias,
                user_priority,
                user_phone_number,
                user_description,
                user_street,
                user_ward,
                user_district,
                user_city,
                avatar_image
            },
            authentication: {
                identifier_email,
                password,
                role
            },

        };

        const result = await updateUser(parseInt(user_id, 10), updateData);

        if (result === -1) {
            return res.status(404).json({ message: 'User not found or already deleted', code: -1 });
        }

        if (result === -2) {
            return res.status(400).json({ message: 'Alias already taken', code: -2 });
        }

        if (result === -3) {
            return res.status(500).json({ message: 'Failed to update user', code: -3 });
        }

        return res.status(200).json({
            message: 'User updated successfully',
            ...result.user,
        });
    } catch (error) {
        terminal.error(`user.controller.js | Update User Error: ${error.message}`);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Soft delete a user (marks the user as inactive instead of permanent deletion).
 * @route DELETE /api/v1/user/:user_id
 * @param {string} user_id - The ID of the user to delete.
 * @returns {Object} 200 - { message: 'User deleted successfully' } if the user was found and marked as deleted
 * @returns {Object} 404 - { message: 'User not found' } if no user with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot delete user' } if the user was not deleted
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await deleteUser(user_id);

        if (result === -1) {
            return res.status(404).json({ message: 'User not found', code: -1 });
        }

        if (!result) {
            return res.status(501).json({ message: 'Cannot delete user', code: -2 });
        }

        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Unexpected error occurred' });
    }
};

/**
 * Soft-lock a user by setting delete_flag to true in the User model.
 * @route PATCH /api/v1/users/:user_id/lock
 * @param {number} user_id - The ID of the user to lock.
 * @returns {Object} 200 - { message: 'User locked successfully' }
 * @returns {Object} 404 - { message: 'User not found or already locked' }
 * @returns {Object} 500 - { message: 'Unexpected error occurred' }
 */
exports.lockUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await lockUser(parseInt(user_id, 10));

        if (result === -1) {
            return res.status(404).json({ message: 'User not found or already locked' });
        }

        if (!result) {
            return res.status(500).json({ message: 'Failed to lock user' });
        }

        if (result === 1) {
            return res.status(200).json({ message: 'User unlocked successfully' });
        }

        return res.status(200).json({ message: 'User locked successfully' });
    } catch (error) {
        terminal.error(`reports.controller.js | Lock User Error: ${error.message}`);
        return res.status(500).json({ message: 'Unexpected error occurred' });
    }
};
