const client = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");

/**
 * Create a notification for a user.
 * @param {number} userId - The target user's ID.
 * @param {Object} data - { type, content, link }
 * @returns {boolean}
 */
module.exports = async (userId, data) => {
	try {
		const timestamp = Date.now();

		const notification = {
			type: data.type,
			content: data.content,
			link: data.link,
			time: timestamp,
		};

		const redisKey = `notifications:${userId}`;
		await client.zAdd(redisKey, [
			{ score: timestamp, value: JSON.stringify(notification) },
		]);

		terminal.success(
			`createNotification | Notification (${data.type}) sent to user ${userId}`,
		);
		return true;
	} catch (err) {
		terminal.error(`createNotification | Error: ${err.message}`);
		return false;
	}
};
