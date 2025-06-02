const {
	User,
	Authentication,
	Favorite,
	Payment,
} = require("../../models/index.model");
const { Op } = require("sequelize");

/**
 * Retrieves a specific user by ID or alias or fetches all users if no ID is provided.
 * @param {number|string} [user_id] - (Optional) The ID or alias of the user to retrieve.
 * @returns {Promise<Object|null|Object[]>} - Returns the user object if an ID or alias is provided.
 *                                          - Returns `null` if the user is not found.
 *                                          - Returns an array of users if no ID or alias is provided.
 */
module.exports = async (user_id, sub_user_id = null) => {
	if (user_id) {
		const user = await User.findOne({
			where: {
				[Op.or]: [{ user_id: user_id }, { user_alias: user_id }],
			},
			include: [
				{
					model: Authentication,
					as: "authentication",
					attributes: ["role"],
					where: {
						delete_flag: false,
					},
				},
				{
					model: Payment,
					as: "payments",
					where: {
						payment_status: "COMPLETED",
						delete_flag: false,
					},
					required: false,
				},
			],
		});

		if (!user) return null;

		let favorite_id = null;
		if (sub_user_id) {
			const favoriteRecord = await Favorite.findOne({
				where: {
					customer_id: sub_user_id,
				},
				include: [
					{
						model: User,
						as: "store",
						where: {
							[Op.or]: [
								{ user_id: user_id },
								{ user_alias: user_id },
							],
							delete_flag: false,
						},
						attributes: [],
					},
				],
			});
			favorite_id = favoriteRecord ? favoriteRecord.favorite_id : -1;
		}

		return {
			...user.toJSON(),
			role: user.authentication?.role || null,
			authentication: undefined,
			favorite_id,
		};
	}

	const users = await User.findAll({
		where: {
			delete_flag: false,
		},
		include: [
			{
				model: Authentication,
				as: "authentication",
				attributes: ["role"],
			},
		],
	});

	return users.map((user) => {
		return {
			...user.toJSON(),
			role: user.authentication?.role || null,
			authentication: undefined,
		};
	});
};
