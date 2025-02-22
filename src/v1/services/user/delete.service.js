const { User } = require("../../models/index");

/**
 * Soft deletes a user by setting the `delete_flag` to true.
 * @param {number} user_id - The ID of the user to be deleted.
 * @returns {Promise<number|boolean>} - Returns `-1` if the user is not found.
 *                                      Returns `true` if deletion was successful.
 *                                      Returns `false` if no records were updated.
 */
exports.deleteUser = async (user_id) => {
    const user = await User.findOne({
        where: {
            user_id,
            delete_flag: false
        }
    });

    if (!user) {
        return -1;
    }

    const [updatedRows] = await User.update(
        {
            delete_flag: true,
            updated_at: new Date()
        },
        {
            where: { user_id }
        }
    );

    return updatedRows > 0;
};
