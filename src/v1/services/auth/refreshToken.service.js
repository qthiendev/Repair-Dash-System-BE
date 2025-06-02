const jwt = require("jsonwebtoken");
const client = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");

require("dotenv").config();

/**
 * Refresh user's access token.
 * @param {string} refreshToken - The old refresh token
 * @returns {string|number} New access token or -1 if invalid.
 */
module.exports = async (refreshToken) => {
	if (!refreshToken) {
		terminal.error("refreshToken.service.js | No refresh token provided.");
		return -1;
	}

	try {
		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET_KEY,
		);
		const userId = decoded.user_id;
		const tokenId = decoded.token_id;

		const redisKey = `refresh:${userId}:${tokenId}`;

		const storedToken = await client.get(redisKey);

		if (!storedToken || storedToken !== refreshToken) {
			terminal.error(
				"refreshToken.service.js | Refresh token is invalid.",
			);
			return -1;
		}

		const newAccessToken = jwt.sign(
			{ user_id: userId },
			process.env.JWT_SECRET_KEY,
			{
				expiresIn: process.env.JWT_EXPIRES_IN,
			},
		);

		return newAccessToken;
	} catch (err) {
		terminal.error(`refreshToken.service.js | Error: ${err.message}`);
		return -1;
	}
};
