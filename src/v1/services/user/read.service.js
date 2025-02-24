const { User } = require('../../models/index.model');

/**
 * Retrieves a specific user by ID or fetches all users if no ID is provided.
 * @param {number} [user_id] - (Optional) The ID of the user to retrieve.
 * @returns {Promise<Object|null|Object[]>} - Returns the user object if an ID is provided.
 *                                          - Returns `null` if the user is not found.
 *                                          - Returns an array of users if no ID is provided.
 */
exports.readUser = async (user_id) => {
    if (user_id) {
        return await User.findOne({
            where: {
                user_id,
                delete_flag: false
            }
        });
    }

    return await User.findAll({
        where: {
            delete_flag: false
        }
    });
};
