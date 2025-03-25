const { User, Authentication } = require('../../models/index.model');
const { Op } = require('sequelize');

/**
 * Retrieves a specific user by ID or alias or fetches all users if no ID is provided.
 * @param {number|string} [user_id] - (Optional) The ID or alias of the user to retrieve.
 * @returns {Promise<Object|null|Object[]>} - Returns the user object if an ID or alias is provided.
 *                                          - Returns `null` if the user is not found.
 *                                          - Returns an array of users if no ID or alias is provided.
 */
module.exports = async (user_id) => {
    if (user_id) {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { user_id: user_id },
                    { user_alias: user_id }
                ],
                delete_flag: false
            },
            include: [
                {
                    model: Authentication,
                    as: 'authentication',
                    attributes: ['role']
                }
            ]
        });

        if (!user) return null;

        const userData = user.get({ plain: true });
        return {
            ...userData,
            role: userData.authentication?.role || null,
            authentication: undefined
        };
    }

    const users = await User.findAll({
        where: {
            delete_flag: false
        },
        include: [
            {
                model: Authentication,
                as: 'authentication',
                attributes: ['role']
            }
        ]
    });

    return users.map(user => {
        const userData = user.get({ plain: true });
        return {
            ...userData,
            role: userData.authentication?.role || null,
            authentication: undefined
        };
    });
};
