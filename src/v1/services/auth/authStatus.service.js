const jwt = require("jsonwebtoken");
const client = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");
require("dotenv").config();

/**
 * Validate an access token and check if the user has an active session.
 * @param {string} token - The JWT access token.
 * @returns {Object} { status: boolean, user_id: number | null }
 */
module.exports = async (token) => {
	if (!token) {
		terminal.warning("authStatus.service.js | No access token provided.");
		return { status: false, user_id: null };
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
		const userId = decoded.user_id;

		const keys = await client.keys(`refresh:${userId}:*`);

		if (!keys.length) {
			terminal.warning(
				"authStatus.service.js | No active session found.",
			);
			return { status: false, user_id: userId };
		}

		terminal.success(
			`authStatus.service.js | User ${userId} is authenticated.`,
		);
		return { status: true, user_id: userId };
	} catch (err) {
		terminal.error(
			`authStatus.service.js | Invalid or expired token: ${err.message}`,
		);
		return { status: false, user_id: null };
	}
};
