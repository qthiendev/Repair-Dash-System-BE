const cloudinary = require("../../../configs/cloudinary.config");

/**
 * Deletes a single image from Cloudinary.
 *
 * @param {string} fileName - The public ID of the image to delete.
 * @returns {Promise<Object>} - Success message or error.
 */
exports.deleteImage = async (fileName) => {
	try {
		await cloudinary.uploader.destroy(fileName);
		return { message: "Image deleted successfully" };
	} catch (error) {
		console.error(`Error deleting image "${fileName}":`, error);
		throw new Error("Failed to delete image");
	}
};

/**
 * Deletes all images in a specified Cloudinary folder.
 *
 * @param {string} folderName - The folder name to delete images from.
 * @returns {Promise<Object>} - Success message or error.
 */
exports.deleteImages = async (folderName) => {
	try {
		const { resources } = await cloudinary.search
			.expression(`folder:${folderName}`)
			.execute();

		if (resources.length === 0) {
			return { message: "No images found in folder" };
		}

		const deletePromises = resources.map((file) =>
			cloudinary.uploader.destroy(file.public_id),
		);

		await Promise.all(deletePromises);
		return { message: "All images in folder deleted successfully" };
	} catch (error) {
		console.error(
			`Error deleting images in folder "${folderName}":`,
			error,
		);
		throw new Error("Failed to delete images in folder");
	}
};
