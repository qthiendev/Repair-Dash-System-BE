const { User } = require('../../models/index.model');

/**
 * Updates user details if the user exists and is not deleted.
 * @param {number} user_id - The ID of the user to update.
 * @param {Object} updateData - The data to update.
 * @returns {Promise<number|boolean>} - Returns `-1` if the user is not found.
 *                                    - Returns `true` if the update is successful.
 *                                    - Returns `false` if no rows were updated.
 * @throws {Error} If no valid fields are provided for the update.
 */
exports.updateUser = async (user_id, updateData) => {

    if (!(await User.findOne({ where: { user_id, delete_flag: false } }))) {
        return -1;
    }

    const allowedFields = ['user_full_name', 'user_phone_number', 'user_address'];
    const filteredData = Object.fromEntries(
        Object.entries(updateData).filter(([key]) => allowedFields.includes(key))
    );

    if (Object.keys(filteredData).length === 0) {
        throw new Error('No valid fields provided for update');
    }

    filteredData.updated_at = new Date();

    const [updatedRows] = await User.update(filteredData, {
        where: {
            user_id,
            delete_flag: false
        }
    });

    return updatedRows > 0;
};
