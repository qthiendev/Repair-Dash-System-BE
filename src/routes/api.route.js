const express = require('express');
const app = express();
const countRoutes = require('./v1/countRoutes.v1');
const userRoutes = require('./v1/userRoutes.v1');

/**
 * @description RESTful API for managing the count.
 *
 * @route GET    /v1/count - Get the current count
 * @route POST   /v1/count - Increment the count by 1
 * @route PUT    /v1/count - Set the count to a specific value
 * @route DELETE /v1/count - Reset the count to 0
 */
app.use('/v1/count', countRoutes);

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

module.exports = app;
