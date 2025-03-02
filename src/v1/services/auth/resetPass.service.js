const bcrypt = require("bcryptjs");
const { Authentication } = require('../../models/index.model');

module.exports = async (email, password) => {
  console.log("email" , email)
    try {
        const salt = bcrypt.genSaltSync(10);
        const newPassword = bcrypt.hashSync(password, salt);

        const result = await Authentication.update(
            { password: newPassword },
            { where: { identifier_email: email } }
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