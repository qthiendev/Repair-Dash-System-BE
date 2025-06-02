const axios = require("axios").default;
const config = require("../../../configs/zalopay.config");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const { User, Payment } = require("../../models/index.model");
const terminal = require("../../../utils/terminal");

require("dotenv").config();

/**
 * Checks the status of a ZaloPay transaction and updates the corresponding payment record.
 *
 * @param {string} trans_id - The transaction ID to check in ZaloPay.
 * @returns {Promise<Object|number>} An object with `code`, `return_code`, and `return_message` on success,
 *                                   or error codes:
 *                                   -1 if payment not found,
 *                                   -2 if no response from ZaloPay,
 *                                   -3 if unable to update payment status.
 */

module.exports = async (trans_id) => {
	const payment = await Payment.findOne({
		where: {
			transaction_id: trans_id,
		},
	});

	if (!payment) {
		terminal.warning(
			`check.zaloplay.service.js | No payment record found for transaction {appTransID:${trans_id}}`,
		);
		return -1;
	}

	const postData = { app_id: config.app_id, app_trans_id: trans_id };
	const data = `${postData.app_id}|${postData.app_trans_id}|${config.key1}`;

	postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

	const response = await axios.post(
		config.endpoint_query,
		qs.stringify(postData),
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		},
	);

	if (!response) {
		terminal.error(
			`check.zaloplay.service.js | Cannot get respone of ${config.endpoint_query} => {appTransID:${trans_id}}`,
		);
		return -2;
	}

	if (response.data.return_code === 2) {
		const updatePayment = await Payment.update(
			{ payment_status: "CANCELED" },
			{
				where: {
					transaction_id: trans_id,
				},
			},
		);

		if (!updatePayment) {
			terminal.warning(
				`check.zaloplay.service.js | Cannot update CANCELED for transaction #${trans_id}}`,
			);
			return -3;
		}

		return {
			code: 1,
			return_code: response.data.return_code,
			return_message: response.data.return_message,
		};
	}

	if (response.data.return_code === 1) {
		const updatePayment = await Payment.update(
			{ payment_status: "COMPLETED" },
			{
				where: {
					transaction_id: trans_id,
				},
			},
		);

		if (!updatePayment) {
			terminal.warning(
				`check.zaloplay.service.js | Cannot update COMPLETED for transaction #${trans_id}}`,
			);
			return -3;
		}

		let user_priority;

		switch (payment.payment_type) {
			case "MONTHLY":
				user_priority = 1;
				break;
			case "YEARLY":
				user_priority = 2;
				break;
			default:
				user_priority = 0;
		}

		const updateUser = await User.update(
			{ user_priority: user_priority },
			{
				where: {
					user_id: payment.user_id,
				},
			},
		);

		if (!updateUser) {
			terminal.warning(
				`check.zaloplay.service.js | Cannot update user_priority for user_id #${payment.user_id}}`,
			);
			return -3;
		}

		return {
			code: 1,
			return_code: response.data.return_code,
			return_message: response.data.return_message,
		};
	}

	return {
		code: 1,
		return_code: response.data.return_code,
		return_message: response.data.return_message,
	};
};
