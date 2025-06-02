const redis = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");
const { Order, Service } = require("../../models/index.model");
const { Op } = require("sequelize");

module.exports = async (user_id, session_id, message) => {
	const order = await Order.findOne({
		where: {
			order_rtc_session_id: session_id,
			delete_flag: false,
			[Op.or]: [
				{ customer_id: user_id },
				{ "$service.owner_id$": user_id },
			],
		},
		include: [{ model: Service, as: "service", attributes: ["owner_id"] }],
		attributes: ["order_id"],
	});

	if (!order) {
		terminal.warning(
			`updateRTCSession.service.js | RTC session ${session_id} not found or unauthorized for user ${user_id}.`,
		);
		return -1;
	}

	const messagesKey = `rtc:session:${session_id}:messages`;
	const timestamp = Date.now();

	const messageData = JSON.stringify({
		senderId: user_id,
		message,
		timestamp,
	});

	await redis.zAdd(messagesKey, [{ score: timestamp, value: messageData }]);
	await redis.expire(messagesKey, 86400);

	return { session_id, user_id, message, timestamp };
};
