const express = require("express");
const app = express();

const userRoutes = require("./user.route");
const authRoutes = require("./auth.route");
const orderRoutes = require("./order.route");
const serviceRoutes = require("./service.route");
const rtcRoutes = require("./rtc.route");
const reportRoutes = require("./report.route");
const searchServiceRoutes = require("./searching.route");
const profileRoutes = require("./profile.route");

/**
 * @description RESTful API for managing users.
 *
 * @route POST   /v1/user       - Create a new user
 * @route GET    /v1/user       - Retrieve all users
 * @route GET    /v1/user/:id   - Retrieve a specific user
 * @route PUT    /v1/user/:id   - Update a user
 * @route DELETE /v1/user/:id   - Soft delete a user
 */
app.use("/v1/users", userRoutes);

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
 * @description RESTful API for managing orders.
 *
 * @route POST   /v1/orders            - Create a new order
 * @route GET    /v1/orders/:order_id?  - Retrieve all orders or a specific order
 * @route PUT    /v1/orders/:order_id   - Update an order
 * @route DELETE /v1/orders/:order_id   - Soft delete an order
 */
app.use("/v1/orders", orderRoutes);

/**
 * @description RESTful API for managing services.
 *
 * @route POST   /v1/service          - Create a new service
 * @route GET    /v1/service/:service_id? - Retrieve all service or a specific service
 * @route GET    /v1/service/store/:owner_id - Retrieve all store services
 * @route PUT    /v1/service/:service_id  - Update a service
 * @route DELETE /v1/service/:service_id  - Soft delete a service
 */
app.use("/v1/services", serviceRoutes);

/**
 * @description Real-time chat (RTC) API endpoints.
 *
 * @route GET  /v1/rtc/:session_id  - Retrieve chat messages for a session
 * @route POST /v1/rtc/:session_id  - Send a message within a chat session
 */
app.use("/v1/rtc", rtcRoutes);

/**
 * @description RESTful API for managing report.
 *
 * @route POST   /v1/report          - Create a new report
 * @route GET    /v1/report/:report_id? - Retrieve all report or a specific report
 * @route GET    /v1/report/admin/:report_id? - Retrieve all report
 * @route DELETE /v1/report/:report_id  - Soft delete a report
 */
app.use("/v1/report", reportRoutes);

/**
 * @description Service search API endpoint.
 *
 * @route GET /v1/service/search - Search for services based on keyword and location priority
 */
app.use("/v1/search", searchServiceRoutes);

/**
 * @description RESTful API for profile user.
 *
 * @route GET /v1/profile - Retrieve user profile
 * @route PUT /v1/profile - Update user profile
 */
app.use("/v1/profile", profileRoutes);

module.exports = app;
