const { User } = require("../../models/index.model");
const sequelize = require("../../../configs/database.config");
const terminal = require("../../../utils/terminal");

/**
 * Soft-locks a user by setting the `delete_flag` to true in the User model.
 * Does not modify the Authentication model's delete_flag.
 * Uses a transaction to ensure consistency.
 * @param {number} user_id - The ID of the user to be locked.
 * @returns {Promise<number|boolean>} - Returns `-1` if the user is not found.
 *                                      Returns `true` if locking was successful.
 *                                      Returns `false` if no records were updated.
 */
module.exports = async (user_id) => {
	const transaction = await sequelize.transaction();

	try {
		const user = await User.findOne({
			where: {
				user_id,
			},
			transaction,
		});

		if (!user) {
			await transaction.rollback();
			terminal.info(`lockUser.service.js | User ${user_id} not found.`);
			return -1;
		}

		const [updatedRows] = await User.update(
			{
				delete_flag: !user.delete_flag,
				updated_at: new Date(),
			},
			{
				where: { user_id },
				transaction,
			},
		);

		if (updatedRows === 0) {
			await transaction.rollback();
			terminal.error(
				`lockUser.service.js | Failed to lock user ${user_id}`,
			);
			return false;
		}

		await transaction.commit();
		terminal.success(
			`lockUser.service.js | Successfully ${user.delete_flag ? "unlocked" : "locked"} user ${user_id}`,
		);
		return user.delete_flag ? 1 : 2;
	} catch (error) {
		await transaction.rollback();
		terminal.error(
			`lockUser.service.js | Error locking user ${user_id}: ${error.message}`,
		);
		return false;
	}
};
