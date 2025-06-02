const createZaloPayService = require("../services/payment/createPayment.zalopay.service");
const checkZaloPayService = require("../services/payment/checkPayment.zalopay.service");
const getSubscriptionService = require("../services/payment/getSubscription.service");
const terminal = require("../../utils/terminal");
const jwt = require("jsonwebtoken");

require("dotenv").config();

/**
 * Initiate a ZaloPay payment.
 * @route POST /api/v1/zalopay/create
 * @body {string} type - Subscription type: 'monthly' or 'yearly'
 * @returns {Object} 200 - { app_trans_id, return_code, ... }
 * @returns {Object} 400 - Invalid input or user
 * @returns {Object} 500 - Internal server error
 */
exports.createZaloPay = async (req, res) => {
	try {
		const { type } = req.query;

		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const result = await createZaloPayService(user_id, type);

		switch (result) {
			case -1:
				return res
					.status(400)
					.json({ message: "Invalid subscription type", code: -1 });
			case -2:
				return res
					.status(400)
					.json({ message: "User not found", code: -2 });
			case -3:
				return res.status(400).json({
					message: "Failed to create payment record",
					code: -3,
				});
			default:
				return res.status(200).json(result);
		}
	} catch (error) {
		terminal.error(
			`zalopay.controller.js | Create Payment Error: ${error.message}`,
		);
		return res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Check ZaloPay transaction status.
 * @route GET /api/v1/zalopay/check/:trans_id
 * @param {string} trans_id - Transaction ID to verify
 * @returns {Object} 200 - { return_code, return_message }
 * @returns {Object} 400 - Transaction not found
 * @returns {Object} 500 - Internal server error
 */
exports.checkZaloPay = async (req, res) => {
	try {
		const { trans_id } = req.params;

		const result = await checkZaloPayService(trans_id);

		switch (result) {
			case -1:
				return res
					.status(400)
					.json({ message: "Transaction not found", code: -1 });
			case -2:
				return res.status(500).json({
					message: "Failed to get response from ZaloPay server",
					code: -2,
				});
			case -3:
				return res.status(500).json({
					message: "Failed to update payment status",
					code: -3,
				});
			default:
				return res.status(200).json(result);
		}
	} catch (error) {
		terminal.error(
			`zalopay.controller.js | Check Payment Error: ${error.message}`,
		);
		return res.status(500).json({ message: "Unexpected error occurred" });
	}
};

/**
 * Get a user's subscription/payment record.
 * @route GET /api/v1/zalopay/subscription/:trans_id
 * @param {string} trans_id - Transaction ID
 * @returns {Object} 200 - Payment record
 * @returns {Object} 400 - Payment not found
 * @returns {Object} 500 - Internal server error
 */
exports.getSubscription = async (req, res) => {
	try {
		const { trans_id } = req.params;
		const user_id = jwt.verify(
			req.cookies?.accessToken,
			process.env.JWT_SECRET_KEY,
		).user_id;

		const result = await getSubscriptionService(user_id, trans_id);

		if (result === -1) {
			return res
				.status(400)
				.json({ message: "Payment not found", code: -1 });
		}

		return res.status(200).json(result);
	} catch (error) {
		terminal.error(
			`zalopay.controller.js | Get Subscription Error: ${error.message}`,
		);
		return res.status(500).json({ message: "Unexpected error occurred" });
	}
};
