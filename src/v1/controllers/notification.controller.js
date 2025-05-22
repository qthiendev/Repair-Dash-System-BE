const jwt = require("jsonwebtoken");
const getNotificationsService = require("../services/notification/getNotification.service");
const terminal = require("../../utils/terminal");
require("dotenv").config();

/**
 * Initiate a ZaloPay payment.
 * @route POST /api/v1/zalopay/create
 * @body {string} type - Subscription type: 'monthly' or 'yearly'
 * @returns {Object} 200 - { app_trans_id, return_code, ... }
 * @returns {Object} 400 - Invalid input or user
 * @returns {Object} 500 - Internal server error
 */
exports.getNotifications = async (req, res) => {
	try {
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const notifications = await getNotificationsService(user_id);

		return res.status(200).json({ notifications: notifications });
	} catch (error) {
		terminal.error(
			`notification.controller.js | Get Notification Error: ${error.message}`,
		);
		return res.status(500).json({ message: "Unexpected error occurred" });
	}
};
