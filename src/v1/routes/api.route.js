const express = require("express");
const app = express();

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const serviceRoutes = require("./service.route");

/**
 * @description RESTful API for managing users.
 *
 * @route POST   /v1/user       - Create a new user
 * @route GET    /v1/user       - Retrieve all users
 * @route GET    /v1/user/:id   - Retrieve a specific user
 * @route PUT    /v1/user/:id   - Update a user
 * @route DELETE /v1/user/:id   - Soft delete a user
 */
app.use("/v1/user", userRoutes);

/**
 * @description Authentication-related API endpoints.
 *
 * @route POST /api/v1/auth/login   - Log in a user
 * @route POST /api/v1/auth/refresh - Refresh an access token
 * @route POST /api/v1/auth/logout  - Log out a user
 * @route POST /api/v1/auth/send_link  - Send link for user
 * @route POST /api/v1/auth/reset_pass  - Reset password a user
 */
app.use("/v1/auth", authRoutes);

/**
 * @description RESTful API for managing services.
 *
 * @route POST   /v1/service          - Create a new service
 * @route GET    /v1/service/:service_id? - Retrieve all users or a specific service
 * @route PUT    /v1/service/:service_id  - Update a service
 * @route DELETE /v1/service/:service_id  - Soft delete a service
 */
app.use("/v1/service", serviceRoutes);

module.exports = app;
