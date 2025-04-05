const { User } = require('../../models/index.model');
const { Op } = require('sequelize');
const uploadService = require('../cloudinary/uploadMedia.service');
const terminal = require('../../../utils/terminal');

/**
 * Updates user details and avatar if provided.
 *
 * @param {number} user_id - The ID of the user to update.
 * @param {Object} updateData - The data to update.
 * @param {File} file - The uploaded avatar file (optional).
 * @returns {Promise<Object|number>} - Response object or error code.
 */
module.exports = async (user_id, updateData) => {
    const user = await User.findOne({ where: { user_id, delete_flag: false } });
    if (!user) {
        terminal.warning(`updateUser.service.js | User ${user_id} not found.`);
        return -1;
    }

    const existingAlias = await User.findOne({
        where:
        {
            user_alias: updateData.user_alias,
            delete_flag: false,
            user_id: { [Op.ne]: user_id },
        },
    });

    if (existingAlias) {
        return -2;
    }

    if (updateData.avatar_image) {
        const fileName = `user_avatar_${user_id}`;
        updateData.user_avatar_url = await uploadService.uploadImage(fileName, updateData.avatar_image);
        if (!updateData.user_avatar_url) {
            terminal.error('updateUser.service.js | Error uploading avatar.');
        }
    }

    const [updatedRows] = await User.update(updateData, { where: { user_id } });

    terminal.success(`updateUser.service.js | User ${user_id} updated.`);

    return updatedRows > 0;
};
