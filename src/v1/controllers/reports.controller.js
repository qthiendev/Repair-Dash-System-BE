const readServiceReportService = require("../services/reports/serviceReports.service");
const getUserStatistics = require("../services/reports/adminReport.service");
const terminal = require("../../utils/terminal");
const jwt = require("jsonwebtoken");

require("dotenv").config();

/**
 * Retrieve service report for the store user with pagination.
 * @route GET /api/v1/services/report/:service_id?
 * @param {number} [service_id] - (Optional) The ID of the service.
 * @query {number} [index] - Page number (default 1).
 * @query {number} [max_range] - Items per page (default 20).
 * @returns {Object} 200 - { total_pages, current_page, services, total } Report data
 * @returns {Object} 404 - { message: 'Service not found or not owned' } if specific service_id is invalid
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.readServiceReport = async (req, res) => {
	try {
		const { service_id } = req.params;
		const { index, max_range } = req.query;

		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const result = await readServiceReportService(
			user_id,
			service_id ?? null,
			Number(index) ?? 1,
			Number(max_range) ?? 10,
		);

		if (result === -1) {
			return res
				.status(404)
				.json({ message: "Service not found or not owned", code: -1 });
		}

		res.status(200).json(result);
	} catch (error) {
		terminal.error(
			`order.controller.js | Read Service Report Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Retrieve user statistics report for admin users with pagination and filters.
 * @route GET /api/v1/users/statistics
 * @query {number} [index] - Page number (default 1).
 * @query {number} [max_range] - Items per page (default 20).
 * @query {string} [user_id] - Filter by user ID.
 * @query {string} [user_full_name] - Filter by full name (partial match).
 * @query {string} [user_alias] - Filter by alias (partial match).
 * @query {string} [user_phone_number] - Filter by phone number (partial match).
 * @query {string} [role] - Filter by role ('ADMIN', 'STORE', 'CUSTOMER').
 * @query {string} [identifier_email] - Filter by email (partial match).
 * @returns {Object} 200 - { total_users, store_users, customer_users, admin_users, users, total_pages, current_page } Statistics data
 * @returns {Object} 500 - { message: 'Unexpected error occurred' } for internal errors
 */
exports.getUserStatistics = async (req, res) => {
	try {
		const {
			index,
			max_range,
			user_id,
			user_full_name,
			user_alias,
			user_phone_number,
			role,
			identifier_email,
		} = req.query;
		const parsedIndex = parseInt(index, 10);
		const parsedMaxRange = parseInt(max_range, 10);
		const finalIndex =
			isNaN(parsedIndex) || parsedIndex < 1 ? 1 : parsedIndex;
		const finalMaxRange =
			isNaN(parsedMaxRange) || parsedMaxRange < 1 ? 20 : parsedMaxRange;

		const filters = {};

		if (user_id) filters.user_id = parseInt(user_id, 10);

		if (user_full_name) filters.user_full_name = user_full_name;

		if (user_alias) filters.user_alias = user_alias;

		if (user_phone_number) filters.user_phone_number = user_phone_number;

		if (role) filters.role = role;

		if (identifier_email) filters.identifier_email = identifier_email;

		const result = await getUserStatistics(
			finalIndex,
			finalMaxRange,
			filters,
		);

		res.status(200).json(result);
	} catch (error) {
		terminal.error(
			`reports.controller.js | Get User Statistics Error: ${error.message}`,
		);
		res.status(500).json({ message: "Unexpected error occurred" });
	}
};
