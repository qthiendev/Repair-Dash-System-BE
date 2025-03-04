const bcrypt = require("bcryptjs");
const sequelize = require('../../../configs/database.config');
const { Authentication } = require('../../models/index.model');
const { Sequelize,QueryTypes } = require("sequelize");


module.exports = async (identifier_email, password) => {
    try {
        const transaction = await sequelize.transaction();
        const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
        const newPassword = bcrypt.hashSync(password, SALT_ROUNDS);

        const [encryptedPassword] = await sequelize.query(
            `SELECT AES_ENCRYPT(:password, :secret) AS encrypted_password`,
            {
                type: QueryTypes.SELECT,
                replacements: { password: newPassword, secret: process.env.DB_SECRET_KEY },
                transaction
            }
        );

        const result = await Authentication.update(
            { password: encryptedPassword.encrypted_password },
            { where: Sequelize.literal(`identifier_email = AES_ENCRYPT('${identifier_email}', '${process.env.DB_SECRET_KEY}')`) }
        );
        
        if (result) {
            return { success: false, message: 'Email not found or password not updated' };
        } else {
            return { success: true, message: 'Password updated successfully' };
        }
    } catch (error) {
        console.error(error); 
        return { success: false, message: 'An error occurred while updating the password' };
    }
};
