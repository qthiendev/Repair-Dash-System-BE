const { Payment } = require("../../models/index.model");
const terminal = require("../../../utils/terminal");

/**
 * Retrieves a subscription/payment record based on user_id and transaction_id.
 *
 * @param {number} user_id - ID of the user
 * @param {string} trans_id - Transaction ID
 * @returns {Promise<Object|number>} The payment record or error code:
 *                                   -1 if no matching payment is found
 */
module.exports = async (user_id, trans_id) => {
	if (!trans_id) {
		const payments = await Payment.findAll({
			attributes: { exclude: ["delete_flag"] },
		});

		if (!payments) {
			terminal.warning(
				`getSubscription.zalopay.service.js | No payment found in system.`,
			);
			return -1;
		}

		return { payments: payments.map((payment) => payment.toJSON()) };
	}

	const payment = await Payment.findOne({
		where: {
			user_id,
			transaction_id: trans_id,
		},
		attributes: { exclude: ["delete_flag"] },
	});

	if (!payment) {
		terminal.warning(
			`getSubscription.zalopay.service.js | No payment found for user_id: ${user_id}, trans_id: ${trans_id}`,
		);
		return -1;
	}

	return { ...payment.toJSON() };
};
