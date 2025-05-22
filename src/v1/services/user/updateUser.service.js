const { User, Authentication } = require("../../models/index.model");
const { Op } = require("sequelize");
const sequelize = require("../../../configs/database.config");
const uploadService = require("../cloudinary/uploadMedia.service");
const terminal = require("../../../utils/terminal");
const bcrypt = require("bcryptjs");

require("dotenv").config();

/**
 * Updates user and authentication details using a transaction.
 * Hashes the password in a single step before updating authentication if provided.
 * Re-reads and returns the updated user and authentication records.
 *
 * @param {number} user_id - The ID of the user to update.
 * @param {Object} updateData - The data to update, with user and authentication fields.
 * @param {Object} updateData.user - User model fields to update (e.g., user_full_name, user_alias).
 * @param {Object} updateData.authentication - Authentication model fields to update (e.g., identifier_email, password).
 * @returns {Promise<Object|number>} - Object with updated user and authentication data, or error code:
 *                                    -1: User not found.
 *                                    -2: User alias already taken.
 *                                    -3: Failed to update user or authentication.
 */
module.exports = async (user_id, updateData) => {
	const transaction = await sequelize.transaction();
	const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

	try {
		const user = await User.findOne({
			where: { user_id, delete_flag: false },
			include: [
				{
					model: Authentication,
					as: "authentication",
					where: { delete_flag: false },
					required: true,
				},
			],
			transaction,
		});

		if (!user) {
			await transaction.rollback();
			terminal.warning(
				`updateUser.service.js | User ${user_id} not found or already soft-deleted`,
			);
			return -1;
		}

		if (
			updateData.user?.user_alias &&
			updateData.user.user_alias !== user.user_alias
		) {
			const existingAlias = await User.findOne({
				where: {
					user_alias: updateData.user.user_alias,
					delete_flag: false,
					user_id: { [Op.ne]: user_id },
				},
				transaction,
			});

			if (existingAlias) {
				await transaction.rollback();
				terminal.warning(
					`updateUser.service.js | Alias ${updateData.user.user_alias} already taken for user ${user_id}`,
				);
				return -2;
			}
		}

		if (updateData.user.avatar_image) {
			const fileName = `user_avatar_${user_id}`;
			const avatarUrl = await uploadService.uploadImage(
				fileName,
				updateData.user.avatar_image,
			);
			if (!avatarUrl) {
				await transaction.rollback();
				terminal.error(
					`updateUser.service.js | Error uploading avatar for user ${user_id}`,
				);
				return -3;
			}
			updateData.user = updateData.user || {};
			updateData.user.user_avatar_url = avatarUrl;
		}

		const userUpdateData = {
			...updateData.user,
			updated_at: new Date(),
		};
		const authUpdateData = {
			...updateData.authentication,
			updated_at: new Date(),
		};

		if (authUpdateData.password) {
			authUpdateData.password = await bcrypt.hash(
				authUpdateData.password,
				SALT_ROUNDS,
			);
		}

		const [userUpdatedRows] = await User.update(userUpdateData, {
			where: { user_id },
			transaction,
		});

		const [authUpdatedRows] = await Authentication.update(authUpdateData, {
			where: { authentication_id: user.authentication_id },
			transaction,
		});

		if (userUpdatedRows === 0 && authUpdatedRows === 0) {
			await transaction.rollback();
			terminal.error(
				`updateUser.service.js | No updates applied for user ${user_id}`,
			);
			return -3;
		}

		const updatedUser = await User.findOne({
			where: { user_id, delete_flag: false },
			include: [
				{
					model: Authentication,
					as: "authentication",
					where: { delete_flag: false },
				},
			],
			transaction,
		});

		if (!updatedUser) {
			await transaction.rollback();
			terminal.error(
				`updateUser.service.js | Updated user ${user_id} not found after update`,
			);
			return -3;
		}

		await transaction.commit();
		terminal.success(
			`updateUser.service.js | User ${user_id} and authentication updated successfully`,
		);

		return {
			user: updatedUser.toJSON(),
			authentication: updatedUser.authentication.toJSON(),
		};
	} catch (error) {
		await transaction.rollback();
		terminal.error(
			`updateUser.service.js | Error updating user ${user_id}: ${error.message}`,
		);
		return -3;
	}
};
