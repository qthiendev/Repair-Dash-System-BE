const { User, Authentication } = require('../../models/index.model');
const sequelize = require('../../../configs/database.config');
const terminal = require('../../../utils/terminal');

/**
 * Soft deletes a user by setting the `delete_flag` to true in both User and Authentication models.
 * Uses a transaction to ensure both updates succeed or are rolled back.
 * @param {number} user_id - The ID of the user to be deleted.
 * @returns {Promise<number|boolean>} - Returns `-1` if the user is not found.
 *                                      Returns `true` if deletion was successful.
 *                                      Returns `false` if no records were updated.
 */
module.exports = async (user_id) => {
    const transaction = await sequelize.transaction();

    try {
        const user = await User.findOne({
            where: {
                user_id,
                delete_flag: false
            },
            include: [{
                model: Authentication,
                as: 'authentication',
                where: { delete_flag: false },
                required: true
            }],
            transaction
        });

        if (!user) {
            await transaction.rollback();
            terminal.info(`deleteUser.service.js | User ${user_id} not found or already soft-deleted`);
            return -1;
        }

        const [userUpdatedRows] = await User.update(
            {
                delete_flag: true,
                updated_at: new Date()
            },
            {
                where: { user_id },
                transaction
            }
        );

        const [authUpdatedRows] = await Authentication.update(
            {
                delete_flag: true,
                updated_at: new Date()
            },
            {
                where: { authentication_id: user.authentication_id },
                transaction
            }
        );

        if (userUpdatedRows === 0 || authUpdatedRows === 0) {
            await transaction.rollback();
            terminal.error(`deleteUser.service.js | Failed to update User or Authentication for user ${user_id}`);
            return false;
        }

        await transaction.commit();
        terminal.success(`deleteUser.service.js | Successfully soft-deleted user ${user_id} and associated authentication`);
        return true;
    } catch (error) {
        await transaction.rollback();
        terminal.error(`deleteUser.service.js | Error soft-deleting user ${user_id}: ${error.message}`);
        return false;
    }
};
