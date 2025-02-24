const express = require('express');
const app = express();

const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');

/**
 * @description RESTful API for managing users.
 *
 * @route POST   /v1/user       - Create a new user
 * @route GET    /v1/user       - Retrieve all users
 * @route GET    /v1/user/:id   - Retrieve a specific user
 * @route PUT    /v1/user/:id   - Update a user
 * @route DELETE /v1/user/:id   - Soft delete a user
 */
app.use('/v1/user', userRoutes);

/**
 * @description Authentication-related API endpoints.
 *
 * @route POST /api/v1/auth/login   - Log in a user
 * @route POST /api/v1/auth/refresh - Refresh an access token
 * @route POST /api/v1/auth/logout  - Log out a user
 */
app.use('/v1/auth', authRoutes);

module.exports = app;
