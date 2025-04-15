const readUser = require('../services/user/readUser.service');
const createUser = require('../services/user/createUser.service');
const deleteUser = require('../services/user/deleteUser.service');
const updateUser = require('../services/user/updateUser.service');
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
 * Update user details.
 * @route PUT /api/v1/user/:user_id
 * @param {string} user_id - The ID of the user to update.
 * @body {string} [user_full_name] - Updated full name (optional)
 * @body {string} [user_phone_number] - Updated phone number (optional)
 * @body {string} [user_address] - Updated address (optional)
 * @returns {Object} 200 - { message: 'User updated successfully' } if the update was successful
 * @returns {Object} 404 - { message: 'User not found' } if no user with the given ID exists
 * @returns {Object} 501 - { message: 'Cannot update user' } if the user was not updated
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.updateUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const updateData = req.body;

        const result = await updateUser(user_id, updateData);

        if (result === -1) {
            return res.status(404).json({ message: 'User not found', code: -1 });
        }

        if (result === -2) {
            return res.status(400).json({ message: 'Alias already taken', code: -2 });
        }

        if (!result) {
            return res.status(501).json({ message: 'Cannot update user', code: -3 });
        }

        return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
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
