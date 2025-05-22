const bcrypt = require("bcryptjs");
const { Authentication } = require("../../models/index.model");

module.exports = async (identifier_email, password) => {
  try {
    const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10);
    const newPassword = bcrypt.hashSync(password, SALT_ROUNDS);

    const result = await Authentication.update(
      { password: newPassword },
      {
        where: { identifier_email },
      }
    );

    if (!result) {
      return {
        success: false,
        message: "Email not found or password not updated",
      };
    } else {
      return { success: true, message: "Password updated successfully" };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "An error occurred while updating the password",
    };
  }
};
