const sequelize = require('../../../configs/database.config');
const bcrypt = require('bcryptjs');
const { User, Authentication } = require('../../models/index.model');
const { Sequelize, QueryTypes } = require('sequelize');
require('dotenv').config();

/**
 * Creates a new user along with authentication details in a single transaction.
 * @param {Object} authData - Authentication details, including email, password, and role.
 * @param {Object} userData - User details, including full name, phone number, and address.
 * @returns {Promise<number>} The created user's ID if successful.
 * @returns {Promise<number>} -1 if the email is already registered.
 * @throws {Error} If user or authentication creation fails.
 */
module.exports = async (authData, userData) => {
    const transaction = await sequelize.transaction();
    const SECRET_KEY = process.env.DB_SECRET_KEY;
    const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);

    try {
        const [encryptedEmail] = await sequelize.query(
            `SELECT AES_ENCRYPT(:email, :secret) AS encrypted_email`,
            {
                type: QueryTypes.SELECT,
                replacements: { email: authData.identifier_email, secret: SECRET_KEY },
                transaction
            }
        );

        const existingUser = await Authentication.findOne({
            where: { identifier_email: encryptedEmail.encrypted_email, delete_flag: false },
            raw: true
        });

        if (existingUser) {
            await transaction.rollback();
            return -1;
        }

        const hashedPassword = await bcrypt.hash(authData.password, SALT_ROUNDS);

        const [encryptedPassword] = await sequelize.query(
            `SELECT AES_ENCRYPT(:password, :secret) AS encrypted_password`,
            {
                type: QueryTypes.SELECT,
                replacements: { password: hashedPassword, secret: SECRET_KEY },
                transaction
            }
        );

        const auth = await Authentication.create(
            {
                identifier_email: encryptedEmail.encrypted_email,
                password: encryptedPassword.encrypted_password,
                role: authData.role
            },
            { transaction }
        );

        if (!auth) throw new Error('Failed to create authentication record.');

        userData.authentication_id = auth.authentication_id;
        const user = await User.create(userData, { transaction });

        if (!user) throw new Error('Failed to create user record.');

        await transaction.commit();
        return user.user_id;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};
