const { Favorite } = require("../../models/index.model");

/**
 * Deletes a favorite.
 * @param {number} favorite_id - The ID of the favorite to delete.
 * @returns {Promise<number>} 1 if deleted, 0 if not found.
 */
module.exports = async (favorite_id) => {
	const deleted = await Favorite.destroy({ where: { favorite_id } });
	return deleted;
};
