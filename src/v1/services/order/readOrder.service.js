const {
	Order,
	User,
	Authentication,
	Service,
	Employee,
} = require("../../models/index.model");
const { Op, Sequelize } = require("sequelize");
const retrieveMedia = require("../cloudinary/retrieveMedia.service");
const getRole = require("../auth/getRole.service");
const terminal = require("../../../utils/terminal");

/**
 * Parses order_description to extract specific descriptions.
 * @param {string} description - The full order_description string.
 * @returns {Object} Extracted descriptions.
 */
const parseOrderDescription = (description) => {
	const result = {
		created_description: null,
		customer_canceled_description: null,
		store_canceled_description: null,
		completed_description: null,
	};

	if (!description) return result;

	const patterns = [
		{
			key: "created_description",
			pattern: /\[Khách hàng đặt đơn: (.*?)\]/,
		},
		{
			key: "customer_canceled_description",
			pattern: /\[Khách hàng hủy đơn: (.*?)\]/,
		},
		{
			key: "store_canceled_description",
			pattern: /\[Cửa hàng hủy đơn: (.*?)\]/,
		},
		{
			key: "completed_description",
			pattern: /\[Hoàn thành đơn hàng: (.*?)\]/,
		},
	];

	patterns.forEach(({ key, pattern }) => {
		const match = description.match(pattern);
		if (match) {
			result[key] = match[1].trim() || null;
		}
	});

	return result;
};

/**
 * Retrieves all non-deleted orders or a specific order by ID.
 * Ensures only ADMIN, the order's customer, or the service owner can access.
 * @param {number|null} order_id - The ID of the order (optional).
 * @param {number} user_id - The user making the request.
 * @returns {Promise<Object[]|Object|number>} Orders list, specific order, -1 if not found, or -2 if unauthorized.
 */
module.exports = async (order_id = null, user_id) => {
	const role = await getRole.byID(user_id);

	if (!role) {
		terminal.warning(
			`order.service.js | No authentication record found for user ${user_id}.`,
		);
		return -2;
	}

	if (order_id) {
		return await getSingleOrder(order_id, user_id, role);
	} else {
		return await getUserOrders(user_id, role);
	}
};

/**
 * Fetches a single order and checks permissions.
 * Includes Service with Owner and available Employees.
 * @param {number} order_id - The ID of the order.
 * @param {number} user_id - The user making the request.
 * @param {string} role - The role of the user (ADMIN, STORE, CUSTOMER).
 * @returns {Promise<Object|number>} Order details or error code.
 */
const getSingleOrder = async (order_id, user_id, role) => {
	const order = await Order.findOne({
		where: { order_id, delete_flag: false },
		attributes: { exclude: ["delete_flag"] },
		include: [
			{
				model: Service,
				as: "service",
				attributes: [
					"service_id",
					"service_name",
					"service_description",
				],
				include: [
					{
						model: User,
						as: "owner",
						attributes: [
							"user_id",
							"user_full_name",
							"user_avatar_url",
						],
						include: {
							model: Employee,
							as: "employees",
							attributes: [
								"employee_id",
								"employee_full_name",
								"employee_avatar_url",
							],
							where: {
								employee_id: {
									[Op.notIn]: Sequelize.literal(
										`(SELECT DISTINCT employee_id FROM orders WHERE order_status = 'PROCESSING' AND employee_id IS NOT NULL)`,
									),
								},
								delete_flag: false,
							},
							required: false,
						},
					},
				],
			},
			{
				model: User,
				as: "customer",
				attributes: ["user_id", "user_full_name", "user_avatar_url"],
			},
		],
	});

	if (!order) {
		terminal.warning(`order.service.js | Order ${order_id} not found.`);
		return -1;
	}

	if (
		role !== "ADMIN" &&
		order.customer_id !== user_id &&
		order.service?.owner?.user_id !== user_id
	) {
		terminal.warning(
			`order.service.js | User ${user_id} not authorized to access order ${order_id}.`,
		);
		return -2;
	}

	const order_images = await retrieveMedia.getImages(order.order_images_url);
	const parsedDescriptions = parseOrderDescription(order.order_description);

	return {
		...order.toJSON(),
		order_images_url: order_images,
		...parsedDescriptions,
	};
};

/**
 * Fetches all orders for a user based on their role.
 * Includes Service with Owner and Employee if assigned.
 * @param {number} user_id - The user making the request.
 * @param {string} role - The role of the user.
 * @returns {Promise<Object[]>} List of orders.
 */
const getUserOrders = async (user_id, role) => {
	const whereCondition = { delete_flag: false };

	whereCondition[Op.or] = [
		{ customer_id: user_id },
		{ "$service.owner_id$": user_id },
	];

	const orders = await Order.findAll({
		where: whereCondition,
		attributes: { exclude: ["delete_flag"] },
		include: [
			{
				model: Service,
				as: "service",
				attributes: [
					"service_id",
					"service_name",
					"service_description",
					"owner_id",
				],
			},
			{
				model: User,
				as: "customer",
				attributes: ["user_id", "user_full_name", "user_avatar_url"],
			},
		],
	});

	return await Promise.all(
		orders.map(async (order) => {
			const order_images = await retrieveMedia.getImages(
				order.order_images_url,
			);
			const parsedDescriptions = parseOrderDescription(
				order.order_description,
			);
			return {
				...order.toJSON(),
				order_images_url: order_images,
				...parsedDescriptions,
			};
		}),
	);
};
