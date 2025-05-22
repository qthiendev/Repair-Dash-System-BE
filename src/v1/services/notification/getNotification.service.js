const client = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");

/**
 * Get all notifications for a user, sorted by time descending.
 * @param {number} userId
 * @returns {Array} List of notifications
 */
module.exports = async (userId) => {
	try {
		const redisKey = `notifications:${userId}`;
		const results = await client.zRange(redisKey, 0, -1);

		const notifications = results.map((item) => JSON.parse(item)).reverse();
		terminal.success(
			`getNotifications.service.js | Retrieved ${notifications.length} notifications for user ${userId}`,
		);
		return notifications;
	} catch (err) {
		terminal.error(`getNotifications.service.js | Error: ${err.message}`);
		return [];
	}
};
