const redis = require("../../../configs/redis.config");
const terminal = require("../../../utils/terminal");
const { Order, Service } = require("../../models/index.model");
const { Op } = require("sequelize");

module.exports = async (user_id, session_id) => {
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
		attributes: ["order_id", "customer_id", "service_id"],
	});

	if (!order) {
		terminal.warning(
			`getRTCSession.service.js | RTC session ${session_id} not found or unauthorized for user ${user_id}.`,
		);
		return -1;
	}

	const messagesKey = `rtc:session:${session_id}:messages`;

	const messages = await redis.zRangeWithScores(messagesKey, 0, -1);

	const formattedMessages = messages.map(({ value, score }) => {
		const { senderId, message } = JSON.parse(value);
		const realTime = new Date(score).toLocaleString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		});

		return {
			user_id: senderId,
			is_sender: senderId === user_id,
			message,
			timestamp: realTime,
		};
	});

	return {
		session_id,
		user_id,
		order_id: order.order_id,
		customer_id: order.customer_id,
		service_id: order.service_id,
		messages: formattedMessages,
	};
};
