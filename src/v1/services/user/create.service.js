const sequelize = require("../../../configs/database.config");
const { User, Authentication } = require("../../models/index");

/**
 * Creates a new user along with authentication details in a single transaction.
 * @param {Object} authData - Authentication details, including email, password, and role.
 * @param {Object} userData - User details, including full name, phone number, and address.
 * @returns {Promise<number>} The created user's ID if successful.
 * @returns {Promise<number>} -1 if the email is already registered.
 * @throws {Error} If user or authentication creation fails.
 */
exports.createUser = async (authData, userData) => {
    const transaction = await sequelize.transaction();

    if (await Authentication.findOne({
        where: {
            identifier_email: authData.identifier_email,
            delete_flag: false
        }
    })) return -1;

    try {
        const auth = await Authentication.create(authData, { transaction });
        if (!auth) {
            throw new Error("Failed to create authentication record.");
        }

        userData.authentication_id = auth.authentication_id;
        const user = await User.create(userData, { transaction });
        if (!user) {
            throw new Error("Failed to create user record.");
        }

        await transaction.commit();
        return user.user_id;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
